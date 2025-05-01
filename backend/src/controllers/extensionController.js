import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// User requests an extension
export const requestExtension = async (req, res) => {
  try {
    let { rentalId, requestedEndTime,additionalAmount } = req.body;
    console.log(requestedEndTime)
    additionalAmount = parseInt(additionalAmount)
    const userId = req.user.id;
    console.log("additional amount")
    console.log(additionalAmount)

    console.log("extension:")
    // Verify the rental belongs to the user
    const rental = await prisma.rental.findFirst({
      where: {
        id: rentalId,
        userId: userId,
        status: 'active'
      },
      include: {
        vehicle: true,
        extensionRequests: {
          where: {
            status: 'approved',
            paymentStatus: 'paid'
          },
          orderBy: {
            endTime: 'desc'
          },
          take: 1
        }
      }
    });

    if (!rental) {
      return res.status(404).json({ error: "Active rental not found or not owned by user" });
    }

    // Use the latest extension end time if available, otherwise use rental end time
    const baseEndTime = rental.extensionRequests.length > 0 
      ? rental.extensionRequests[0].endTime 
      : rental.endTime;

    // Validate requested end time is in the future and after current end time
    const requestedEnd = new Date(requestedEndTime)
    if (requestedEnd <= baseEndTime) {
      return res.status(400).json({ 
        error: "Requested end time must be after current rental end time",
        currentEndTime: baseEndTime
      });
    }

    // const timeDiff = requestedEnd - baseEndTime;
    // const hours = timeDiff / (1000 * 60 * 60);
    // const additionalAmount = Math.ceil(hours) * rental.vehicle.pricePerHour;
    // console.log("Additional amount")
    // console.log(additionalAmount)

    // Create extension request
    const extensionRequest = await prisma.rentalExtensionRequest.create({
      data: {
        rentalId,
        requestedEndTime: requestedEnd,
        additionalAmount,
        startTime: baseEndTime,
        endTime: requestedEnd,
        status: "pending",
        paymentStatus: "pending"
      }
    });

    res.status(201).json({
      message: "Extension request submitted for admin approval",
      extensionRequest
    });

  } catch (error) {
    console.error("Error requesting extension:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin approves/rejects extension
export const processExtension = async (req, res) => {
  try {
    const { extensionId, action } = req.body;

    console.log("extension id")
    console.log(extensionId)
    const extension = await prisma.rentalExtensionRequest.findUnique({
      where: { id: extensionId },
      include: { 
        rental: {
          include: {
            vehicle: true
          }
        } 
      }
    });

    if (!extension) {
      return res.status(404).json({ error: "Extension request not found" });
    }

    if (extension.status !== 'pending') {
      return res.status(400).json({ error: "Extension request has already been processed" });
    }

    if (action === 'approve') {
      const updatedExtension = await prisma.rentalExtensionRequest.update({
        where: { id: extensionId },
        data: { 
          status: "approved",
          paymentStatus: "pending"
        }
      });

      return res.json({ 
        message: "Extension approved. User must complete payment.",
        extension: updatedExtension
      });

    } else if (action === 'reject') {
      await prisma.rentalExtensionRequest.update({
        where: { id: extensionId },
        data: { 
          status: "rejected",
          paymentStatus: "failed"
        }
      });

      return res.json({ message: "Extension rejected" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

  } catch (error) {
    console.error("Error processing extension:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User pays for approved extension
export const payForExtension = async (req, res) => {
  const { extensionId } = req.body;
  console.log(extensionId)
  try {
    const userId = req.user.id;


    // Verify the extension is approved and payment is pending
    const extension = await prisma.rentalExtensionRequest.findFirst({
      where: {
        id: extensionId,
        status: "approved",
        paymentStatus: { in: ["pending", "failed","initiated"] }, // Allow both statuses
        rental: {
          userId: userId,
          status: "active"
        }
      },
      include: {
        rental: {
          include: {
            vehicle: true,
            user: true
          }
        }
      }
    });
    if (!extension) {
      return res.status(404).json({ 
        error: "Extension not found, not approved, or already paid" 
      });
    }

    // Convert amount to paisa (Khalti requires amount in paisa)
    const amount = extension.additionalAmount * 100;

    // Initiate payment with Khalti
    const options = {
      method: "POST",
      url: "https://dev.khalti.com/api/v2/epayment/initiate/",
      headers: {
        Authorization: "Key 73e1324761654a95aac003f6301bafec",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        return_url: "http://localhost:5173/extension/payment/verify",
        website_url: "https://localhost:5173",
        amount: amount.toString(),
        purchase_order_id: `EXT-${extensionId}`,
        purchase_order_name: `Extension for Rental #${extension.rentalId}`,
        customer_info: {
          name: `${extension.rental.user.firstName} ${extension.rental.user.lastName}`,
          email: extension.rental.user.email,
          phone: extension.rental.user.contactNumber,
        },
      }),
    };

    const response = await axios(options);
    const paymentUrl = response.data.payment_url;

    // Update payment status to initiated
    await prisma.rentalExtensionRequest.update({
      where: { id: extensionId },
      data: { paymentStatus: "initiated" }
    });

    res.status(200).json({ 
      payment_url: paymentUrl,
      extensionId 
    });

  } catch (error) {
    console.error("Error initiating extension payment:", error);
    
    await prisma.rentalExtensionRequest.update({
      where: { id: extensionId },
      data: { paymentStatus: "failed" }
    });
    
    res.status(500).json({ 
      error: "Failed to initiate payment",
      details: error.response?.data || error.message 
    });
  }
};

// Verify payment after user returns from payment gateway
export const verifyExtensionPayment = async (req, res) => {
  let { pidx, extensionId } = req.body;
  extensionId = parseInt(extensionId);
  try {

    // First verify the payment with Khalti
    const verifyOptions = {
      method: "POST",
      url: "https://dev.khalti.com/api/v2/epayment/lookup/",
      headers: {
        Authorization: "Key 73e1324761654a95aac003f6301bafec",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ pidx }),
    };

    const verification = await axios(verifyOptions);
    const paymentStatus = verification.data.status;
    console.log("payment status")
    console.log(paymentStatus)

    if (paymentStatus !== 'Completed') {
      await prisma.rentalExtensionRequest.update({
        where: { id: extensionId },
        data: { paymentStatus: "failed" }
      });
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Get the extension details
    const extension = await prisma.rentalExtensionRequest.findUnique({
      where: { id: extensionId },
      include: {
        rental: true
      }
    });

    if (!extension) {
      return res.status(404).json({ error: "Extension not found" });
    }

    // Update rental end time and mark as paid in a transaction
    await prisma.$transaction([
      prisma.rental.update({
        where: { id: extension.rentalId },
        data: { 
          endTime: extension.requestedEndTime,
          amount: {
            increment: extension.additionalAmount
          }
        }
      }),
      prisma.rentalExtensionRequest.update({
        where: { id: extensionId },
        data: { 
          paymentStatus: "paid"
        }
      })
    ]);

    res.json({ 
      message: "Extension payment completed successfully",
      status: "paid"
    });

  } catch (error) {
    console.error("Error verifying extension payment:", error);
    
    await prisma.rentalExtensionRequest.update({
      where: { id: extensionId },
      data: { paymentStatus: "failed" }
    });
    
    res.status(500).json({ 
      error: "Failed to verify payment",
      details: error.response?.data || error.message 
    });
  }
};

// Get extensions for a specific rental
export const getRentalExtensions = async (req, res) => {
  try {
    let { rentalId } = req.params;
    rentalId = parseInt(rentalId)
    const userId = req.user.id;

    // Verify rental belongs to user
    const rental = await prisma.rental.findFirst({
      where: {
        id: rentalId,
        userId: userId
      }
    });

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const extensions = await prisma.rentalExtensionRequest.findMany({
      where: { rentalId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(extensions);
  } catch (error) {
    console.error("Error fetching rental extensions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get pending approval extensions (for admin)
export const getPendingExtensions = async (req, res) => {
  try {
    const extensions = await prisma.rentalExtensionRequest.findMany({
      where: { 
        status: "pending",
        rental: {
          status: "active"
        }
      },
      include: {
        rental: {
          include: {
            user: true,
            vehicle: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(extensions);
  } catch (error) {
    console.error("Error fetching pending extensions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all extensions (for admin)
export const getAllExtensions = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    
    const extensions = await prisma.rentalExtensionRequest.findMany({
      where,
      include: {
        rental: {
          include: {
            user: true,
            vehicle: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(extensions);
  } catch (error) {
    console.error("Error fetching extensions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import { PrismaClient } from "@prisma/client";
import axios from "axios"; // Use axios instead of the deprecated request library


const prisma = new PrismaClient();

export default async function payment(req, res) {
  try {
    // Extract amount from the request body
    const user = req.user
    console.log("user")
    console.log(user)

    const userId = user.id
    console.log(userId)
    let {vehicleId, startDateTime, endDateTime, amount
    } = req.body;
    amount = amount*100;
    console.log(vehicleId, startDateTime,endDateTime,amount)
    const response = await createRental(parseInt(userId),parseInt(vehicleId),startDateTime,endDateTime,amount)

    console.log(response.id)
    // Validate the amount
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid or missing amount" });
    }
    console.log("Received amount:", amount);

    // Prepare the request options for Khalti API 
    const options = {
      method: "POST",
      url: "https://dev.khalti.com/api/v2/epayment/initiate/",
      headers: {
        Authorization: "key 73e1324761654a95aac003f6301bafec", // Replace with your actual Khalti API key
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        return_url: "http://localhost:5173/payment/verify", // Replace with your actual return URL
        website_url: "https://localhost:5173", // Replace with your actual website URL
        amount: amount.toString(), // Convert amount to string
        purchase_order_id: "Order01", // Replace with your actual order ID
        purchase_order_name: "test", // Replace with your actual order name
          customer_info: {
          name: "Ram Bahadur", // Replace with actual customer name
          email: "test@khalti.com", // Replace with actual customer email
          phone: "9800000001", // Replace with actual customer phone
        },
      }),
    };
    // Make the request to Khalti API
    const rental_id = response.id
    axios(options)
      .then((response) => {
        const paymentUrl = response.data.payment_url;
        res.status(200).json({ payment_url: paymentUrl,rentalId:rental_id }); // Send the payment URL back to the client
      })
      .catch((error) => {
        console.error("Error calling Khalti API:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
      });
  } catch (error) {
    console.error("Error in payment function:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createRental(userId, vehicleId, startDateTime, endDateTime, amount) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString();
  console.log("vechile id:"+vehicleId)
  try {
    const response = await prisma.rental.create({
      data: {
        user: {
          connect: { id: userId }  // Connect to existing user
        },
        vehicle: {
          connect: { id: vehicleId }  // Connect to existing vehicle
        },
        startTime: new Date(startDateTime).toISOString(),
        endTime:new Date(endDateTime).toISOString(),
        amount: 0,
        status: "active",
        paymentStatus: "unpaid",
        createdAt: formattedDate
      },
      include: {
        user: true,    // Include user in response if needed
        vehicle: true  // Include vehicle in response if needed
      }
    });
    // await prisma.vehicle.update({
    //   where: { id: vehicleId },
    //   data: {
    //     available: { decrement: 1 },
    //     rented: { increment: 1 },
    //   },
    // });
    return response;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
}

async function verifyPayment(req,res){

    const {vehicleId, pidx} =  req.body;
  const response =await axios.post("https://dev.khalti.com/api/v2/epayment/lookup/", {
    pidx:pidx
  })

  console.log(response.data)

  res.send("Succeess")
}


export {verifyPayment}

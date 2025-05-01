import { PrismaClient } from '@prisma/client';
import express, { response } from "express"
const router  = express.Router();
const prisma = new PrismaClient();


router.get("/user", getAllCustomers)



router.get("/rentals", getVehicleRentals)

async function getAllCustomers (req,res) {
    const users = [];
    const response =  await prisma.user.findMany({
        where:{
            role:"USER"
        }
    }) ;  
    console.log(response)
     res.send(response);

}

router.patch("/rentals/:rentalId/complete", async (req,res) => {
    const rentalId = parseInt(req.params.rentalId);
    
    try {
        // First get the rental with its associated vehicle
        const rental = await prisma.rental.findUnique({
            where: {
                id: rentalId
            },
            include: {
                vehicle: true
            }   
        });

        if (!rental) {
            return res.status(404).send("Rental not found");
        }

        // Update the vehicle's available and rented counts
        const updatedVehicle = await prisma.vehicle.update({
            where: {
                id: rental.vehicleId
            },
            data: {
                available: {
                    increment: 1
                },
                rented: {
                    decrement: 1
                }
            }
        });

        // You might also want to update the rental status to "completed"
        await prisma.rental.update({
            where: {
                id: rentalId
            },
            data: {
                status: "completed"
            }
        });

        res.send("Rental completed successfully");
    } catch (error) {
        console.error("Error completing rental:", error);
        res.status(500).send("Internal server error");
    }
});


async function getVehicleRentals(req,res) {
    const  response = await prisma.rental.findMany({
        include:{
            user:true,
            vehicle:true
        }
    })

    res.send(response)
    
}




router.get('/dashboard/stats', async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await prisma.user.count();
    
    // Get total vehicles count
    const totalVehicles = await prisma.vehicle.count();
    
    // Get total rentals count
    const totalRentals = await prisma.rental.count();
    
    // Get total revenue (sum of all rental amounts)
    const revenueResult = await prisma.rental.aggregate({
      _sum: {
        amount: true
      }
    });
    const totalRevenue = revenueResult._sum.amount || 0;
    
    res.json({
      totalUsers,
      totalVehicles,
      totalRentals,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vehicle statistics endpoint
router.get('/dashboard/vehicles', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        vehicleName: true,
        type: true,
        available: true,
        rented: true
      },
      orderBy: {
        rented: 'desc'
      }
    });
    
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User rental counts endpoint
router.get('/dashboard/user-rentals', async (req, res) => {
  try {
    const usersWithRentals = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        _count: {
          select: {
            rentals: true
          }
        }
      },
      orderBy: {
        rentals: {
          _count: 'desc'
        }
      },
      take: 10 // Get top 10 users with most rentals
    });
    
    // Format the data for the chart
    const formattedData = usersWithRentals.map(user => ({
      name: `${user.firstName} ${user.lastName}`,
      rentals: user._count.rentals,
      email: user.email
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching user rental stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rental by vehicle type endpoint

// Rental by vehicle type endpoint - CORRECTED VERSION
router.get('/dashboard/rentals-by-type', async (req, res) => {
    try {
      // First get all rentals with their vehicle types
      const rentals = await prisma.rental.findMany({
        include: {
          vehicle: {
            select: {
              type: true
            }
          }
        }
      });
  
      // Then group by vehicle type
      const rentalsByType = rentals.reduce((acc, rental) => {
        const type = rental.vehicle.type;
        if (!acc[type]) {
          acc[type] = 0;
        }
        acc[type]++;
        return acc;
      }, {});
  
      // Format for the chart
      const formattedData = Object.entries(rentalsByType).map(([name, rentals]) => ({
        name,
        rentals
      })).sort((a, b) => b.rentals - a.rentals);
  
      res.json(formattedData);
    } catch (error) {
      console.error('Error fetching rentals by type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


export default router;
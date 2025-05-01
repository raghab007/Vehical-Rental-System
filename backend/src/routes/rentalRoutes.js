import { PrismaClient } from "@prisma/client";
import express from "express"
import { auth } from "../middlewares/authenticationMiddleware.js";
const rentalRouter = express.Router();
const prishmaClient = new PrismaClient();


rentalRouter.post("/update",async function(req,res){
    let {rentalId,amount} = req.body;
    amount = parseInt(amount)
   const response = await prishmaClient.rental.update({
        where:{
            id:parseInt(rentalId)
        },
        data:  {
            status:"active",
            paymentStatus:"Completed",
            amount:amount
        },
        include:{
            vehicle:true
        }
        
    })

   
    const vehicleId = response.vehicle.id

    const response1 = await prishmaClient.vehicle.update({
        where: {
          id: vehicleId,  // Assuming vehicleId is the ID of the vehicle you want to update
        },
        data: {
          available: {
            decrement: 1  // Decrease available count by 1
          },
          rented: {
            increment: 1  // Increase rented count by 1
          }
        }
      });

      res.send("succeess")
})


// Get user rentals
rentalRouter.get("/rentals", auth, async (req, res) => {
    try {
        const rentals = await prishmaClient.rental.findMany({
            where: { 
                userId: req.user.id,
            // or include this if you're filtering by status
            },
            include: {
                vehicle: {
                    select: {
                        vehicleName: true,
                        type: true,
                        model: true,
                        company: true,
                        fuelType: true,
                        passengerSeat: true,
                        imageUrl: true,
                        pricePerHour: true,
                        description: true
                    }
                }
            },
            orderBy: { startTime: 'desc' }
        });

        res.status(200).json({ 
            success: true, 
            data: rentals 
        });

    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch rentals',
            error: error.message 
        });
    }
});

export default rentalRouter
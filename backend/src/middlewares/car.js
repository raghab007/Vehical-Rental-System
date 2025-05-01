// import express from "express"
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// // POST endpoint to save a vehicle
// async function saveVechicle (req, res)  {
//   try {
//     // Extract vehicle data from the request body
//     const {
//       vehicleName,
//       type,
//       model,
//       company,
//       fuelType,
//       passengerSeat,
//       imageUrl,
//       pricePerHour,
//     } = req.body;

//     // Validate required fields
//     if (
//       !vehicleName ||
//       !type ||
//       !model ||
//       !company ||
//       !fuelType ||
//       !passengerSeat ||
//       !imageUrl ||
//       !pricePerHour
//     ) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Save the vehicle to the database
//     const newVehicle = await prisma.vehicle.create({
//       data: {
//         vehicleName,
//         type,
//         model,
//         company,
//         fuelType,
//         passengerSeat,
//         imageUrl,
//         pricePerHour,
//       },
//     });

//     // Return the saved vehicle as a response
//     res.status(201).json(newVehicle);
//   } catch (error) {
//     console.error("Error saving vehicle:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }


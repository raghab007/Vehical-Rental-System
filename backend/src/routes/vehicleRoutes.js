import express from "express"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import upload from "../config/multerConfig.js";
const router = express.Router();

// GET all vehicles
router.get("/get", async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    res.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new vehicle
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      vehicleName,
      type,
      model,
      company,
      fuelType,
      passengerSeat,
      pricePerHour,
      description,
      available
    } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    // Validation
    if (!vehicleName || !type || !model || !company || !fuelType || 
        !passengerSeat || !pricePerHour || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new vehicle
    const newVehicle = await prisma.vehicle.create({
      data: {
        vehicleName,
        type,
        model,
        company,
        fuelType,
        passengerSeat: parseInt(passengerSeat),
        imageUrl,
        pricePerHour: parseFloat(pricePerHour),
        description,
        available: parseInt(available),
        rented: 0 
      }
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Error saving vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single vehicle
router.get("/get/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE vehicle
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      vehicleName,
      type,
      model,
      company,
      fuelType,
      passengerSeat,
      pricePerHour,
      description,
      available
    } = req.body;

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!existingVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Use existing image if no new image is uploaded
    const imageUrl = req.file ? req.file.path : existingVehicle.imageUrl;

    // Update vehicle
    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        vehicleName,
        type,
        model,
        company,
        fuelType,
        passengerSeat: parseInt(passengerSeat),
        imageUrl,
        pricePerHour: parseFloat(pricePerHour),
        description,
        available: parseInt(available)
      }
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE vehicle
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id }
    });

    if (!existingVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    // Check if vehicle is currently rented
    if (existingVehicle.rented > 0) {
      return res.status(400).json({ 
        error: "Cannot delete vehicle that is currently rented" 
      });
    }

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id }
    });

    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
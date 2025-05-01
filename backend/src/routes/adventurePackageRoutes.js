import express from "express";
import { PrismaClient } from "@prisma/client";
import upload from "../config/multerConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

// Serve static files from uploads directories
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Get all active packages
router.get("/", async (req, res) => {
  try {
    const packages = await prisma.adventurePackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// Create new package with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, duration, inclusions, vehicleType, startPoint, price } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newPackage = await prisma.adventurePackage.create({
      data: {
        title,
        description,
        duration,
        inclusions,
        vehicleType,
        startPoint,
        price,
        imageUrl: imagePath
      },
    });
    
    res.status(201).json(newPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(400).json({ 
      error: "Failed to create package",
      details: error.message 
    });
  }
});

// Update package with optional image update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, duration, inclusions, vehicleType, startPoint, price } = req.body;
    
    const updateData = {
      title,
      description,
      duration,
      inclusions,
      vehicleType,
      startPoint,
      price,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      
      // Optionally delete the old image file
      const oldPackage = await prisma.adventurePackage.findUnique({
        where: { id: parseInt(req.params.id) },
      });
      
      if (oldPackage?.imageUrl) {
        const oldImagePath = path.join(__dirname, "..", oldPackage.imageUrl);
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    }

    const updatedPackage = await prisma.adventurePackage.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });
    
    res.json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(400).json({ error: "Failed to update package" });
  }
});

// Delete package (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const deletedPackage = await prisma.adventurePackage.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false },
    });
    
    res.json(deletedPackage);
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(400).json({ error: "Failed to delete package" });
  }
});

export default router;
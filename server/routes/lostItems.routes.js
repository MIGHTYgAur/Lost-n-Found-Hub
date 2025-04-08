import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from 'multer';
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });

const lostRouter = express.Router();
const prisma = new PrismaClient();

// Get all lost items
lostRouter.get("/", async (req, res) => {
    try {
        const items = await prisma.lostItem.findMany({
            include: {
                user: true,
            },
        });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
});

// Get lost items reported by a specific user
lostRouter.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const lostItems = await prisma.lostItem.findMany({
        where: { userId: userId }, 
      });
  
      if (!lostItems || lostItems.length === 0) {
        return res.status(404).json({ error: 'No lost items found for this user' });
      }
  
      res.json(lostItems);
    } catch (error) {
      console.error('Error fetching lost items for user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get a lost item by ID

lostRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const item = await prisma.lostItem.findUnique({
            where: { id: Number(id) },
            include: {
                user: true,
            },
        });
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}
);

// Add a new lost item
lostRouter.post("/",  upload.single("image"), async (req, res) => {

    const { name, description, category, dateLost, location, userId } = req.body;
    try {
        let imageUrl = null;
        if (req.file) {
            try {
              imageUrl = await uploadToCloudinary(req.file.buffer); // await is essential
            } catch (cloudErr) {
              console.error("Cloudinary upload error:", cloudErr);
              return res.status(500).json({ error: "Failed to upload image to Cloudinary" });
            }
          }
        const lostItem = await prisma.lostItem.create({
            data: { name, description, category, dateLost: new Date(dateLost), location, imageUrl, userId },
        });
        res.json(lostItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}
);

// Delete a lost item by ID
lostRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedItem = await prisma.lostItem.delete({
            where: { id: Number(id) },
        });
        res.json(deletedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
}
);

export default lostRouter;
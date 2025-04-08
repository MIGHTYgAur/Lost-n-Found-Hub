import express from "express";
import { PrismaClient } from "@prisma/client";      
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import stream from "stream";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const upload = multer({ storage: multer.memoryStorage() });
const foundRouter = express.Router();

foundRouter.get("/", async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const items = await prisma.foundItem.findMany({
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
}
);
foundRouter.post("/", upload.single("image"), async (req, res) => {
    const prisma = new PrismaClient();
    const { name, description, category, dateFound, location, imageUrl, userId } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        if (!name || !description || !category || !dateFound || !location || !userId) {
            return res.status(400).json({ error: "All fields are required" });
        }
    
    
        const photoUpload = await new Promise((resolve, reject) => {  //upload to cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        reject(error); // Reject the promise on error
                    } else {
                        resolve(result); // Resolve the promise with the upload result
                    }
                }
            );
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer); // Pass the buffer into the stream
            bufferStream.pipe(uploadStream); // Pipe the file stream to Cloudinary
        });
        const photoUrl = photoUpload.secure_url;
        console.log(photoUrl);

        const foundItem = await prisma.foundItem.create({
            data: { name, description, category, dateFound: new Date(dateFound), location, imageUrl: photoUrl, userId },
        });
        res.json(foundItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
});

// Get found items reported by a specific user
foundRouter.get('/user/:userId', async (req, res) => {
    const prisma = new PrismaClient();
    const { userId } = req.params;
  
    try {
      const foundItems = await prisma.foundItem.findMany({
        where: { userId: userId }
      });
  
      if (!foundItems || foundItems.length === 0) {
        return res.status(404).json({ error: 'No found items found for this user' });
      }
  
      res.json(foundItems);
    } catch (error) {
      console.error('Error fetching found items for user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
foundRouter.get("/:id", async (req, res) => {    
    const prisma = new PrismaClient();
    const { id } = req.params;
    try {
        const item = await prisma.foundItem.findUnique({
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

foundRouter.delete("/:id", async (req, res) => {
    const prisma = new PrismaClient();
    const { id } = req.params;
    try {
        const item = await prisma.foundItem.delete({
            where: { id: Number(id) },
        });
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect();
    }
});

export default foundRouter;
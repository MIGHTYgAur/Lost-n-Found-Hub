import express from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import cors from "cors";
import AuthRouter from "./routes/auth.routes.js";
import UserRouter from "./routes/user.routes.js";
import foundRouter from "./routes/foundItems.routes.js";
import lostRouter from "./routes/lostItems.routes.js";
import claimRouter from "./routes/claim.routes.js";
import { authenticateToken } from "./middlewares/auth.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

dotenv.config();
cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
    });
const app = express();

const prisma = new PrismaClient();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Add Lost Item
// app.post("/lost", async (req, res) => {
//     const { name, description, category, dateLost, location, imageUrl, userId } = req.body;
//     const lostItem = await prisma.lostItem.create({
//         data: { name, description, category, dateLost: new Date(dateLost), location, imageUrl, userId }
//     });
//     res.json(lostItem);
// });

// // Get Lost Items
// app.get("/lost", async (req, res) => {
//     const items = await prisma.lostItem.findMany();
//     res.json(items);
// });

//auth
app.use('/api/auth', AuthRouter);
//users
app.use('/api/users', authenticateToken, UserRouter)

app.use('/api/found', authenticateToken, foundRouter);
app.use('/api/lost', authenticateToken, lostRouter);
app.use('/api/claim', authenticateToken, claimRouter);
//matches

app.listen(5000, () => console.log("Server running on port 5000"));

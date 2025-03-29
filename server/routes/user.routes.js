import express from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

const UserRouter = express.Router();

UserRouter.get("/", async (req, res) => {});
UserRouter.post("/", async (req, res) => {
});

import express from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import {getUserById, getUser} from "../controllers/user.controllers.js";
dotenv.config();
const prisma = new PrismaClient();

const UserRouter = express.Router();

UserRouter.post("/", getUser);
UserRouter.post("/:id", getUserById);

export default UserRouter;

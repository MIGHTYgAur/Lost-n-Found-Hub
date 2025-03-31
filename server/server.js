import express, { json } from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(json());
app.use("/", UserRouter)

app.listen(5000, () => console.log("Server running on port 5000"));

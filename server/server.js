import express, { json } from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
app.use(json());

// Add Lost Item
app.post("/lost", async (req, res) => {
    const { name, description, category, dateLost, location, imageUrl, userId } = req.body;
    const lostItem = await prisma.lostItem.create({
        data: { name, description, category, dateLost: new Date(dateLost), location, imageUrl, userId }
    });
    res.json(lostItem);
});

// Get Lost Items
app.get("/lost", async (req, res) => {
    const items = await prisma.lostItem.findMany();
    res.json(items);
});


// Add Found Item
app.post("/found", async (req, res) => {
    const { name, description, category, dateFound, location, imageUrl, userId } = req.body;
    const foundItem = await prisma.foundItem.create({
        data: { name, description, category, dateFound: new Date(dateFound), location, imageUrl, userId }
    });
    res.json(foundItem);
});

// Get Found Items
app.get("/found", async (req, res) => {
    const items = await prisma.foundItem.findMany();
    res.json(items);
});


//users
app.get("/users", async(req, res) =>{
    const users = await prisma.user.findMany();
    res.json(users);
})

app.post("/users", async(req, res) =>{
    const {name, email, role, password} = req.body;
    const user = await prisma.user.create({
        data: {name, email,role, password}
    });
    res.json(user);
})

//matches

app.get("/match/:UserId", async (req, res) => {
app.post()

console.log(date);
app.listen(5000, () => console.log("Server running on port 5000"));

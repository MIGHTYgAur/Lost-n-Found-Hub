import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUser = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
}

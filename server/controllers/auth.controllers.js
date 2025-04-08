import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
    try {
        const { Name, email, password, role } = req.body;

        // Hash password
        if (!Name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in DB
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser) return res.status(409).json({ error: 'User already exists' });

        const user = await prisma.user.create({
            data: {
                name:Name,
                email,
                password: hashedPassword,
                role
            }
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'User not found, Register first' });

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201)
        .cookie(
            'token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict',
            path: '/',
        })
        .json({ message: 'Login successful', user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful' });
}

export const checkAuth = async (req, res) => {
    try {
      // console.log(req.cookies);
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }
      // Verify the token
      const user = jwt.verify(token, process.env.JWT_SECRET);
  
      // Return the user details from the token
      res.status(200).json({user});
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized: Token expired' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };
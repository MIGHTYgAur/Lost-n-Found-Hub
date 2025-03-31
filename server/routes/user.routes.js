import express from 'express';
import { signUpUser, loginUser, logoutUser } from '../controllers/auth.controllers.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controllers.js';

const UserRouter = express.Router();

// 🔐 Auth Routes
UserRouter.post('/signup', signUpUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/logout', logoutUser);

// 🔐 User CRUD Routes
UserRouter.get('/', getAllUsers); // Admin Only
UserRouter.get('/:id', getUserById);
UserRouter.put('/:id', updateUser);
UserRouter.delete('/:id', deleteUser); // Admin Only

export default UserRouter;

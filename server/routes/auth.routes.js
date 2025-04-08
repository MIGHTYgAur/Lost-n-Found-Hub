import express from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/auth.controllers.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", logoutUser);
AuthRouter.get("/me", checkAuth);
export default AuthRouter;
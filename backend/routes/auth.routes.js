import express from "express";
import {
  signUp,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/auth.controllers.js";

let authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;

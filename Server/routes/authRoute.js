import express from "express";
import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  sendOtp,
  verifyOtp,
  googleAuth,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);

//Otp Route section
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

//Google SignUp and Sign In
authRouter.post("/google-auth", googleAuth);

export default authRouter;

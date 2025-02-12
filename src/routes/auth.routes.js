import { Router } from "express";
import { authControllers } from "../controllers/auth.controller.js";
import { registerValidator } from "../validation/validators.js";
import { validateDate } from "../middlewares/validateMiddleware.js";
export const authRouters = Router();

authRouters.post(
  "/signup",
  validateDate(registerValidator),
  authControllers.signUp
);
authRouters.post("/login", authControllers.login);

authRouters.post("/refresh-token", authControllers.refreshToken);

// VERIFY OTP
authRouters.post("/verify", authControllers.verifyOTP);

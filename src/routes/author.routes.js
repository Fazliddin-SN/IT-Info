import { Router } from "express";
import { authorControllers } from "../controllers/index.js";
import { roleGuard, verifyToken } from "../middlewares/index.js";
import { validateDate } from "../middlewares/validateMiddleware.js";
import { authorValidation } from "../validation/validators.js";

export const auhtorRouter = Router();
//SIGN UP
auhtorRouter.post(
  "/authors/signup",
  validateDate(authorValidation),
  authorControllers.signup
);
// LOGIN
auhtorRouter.post("/authors/login", authorControllers.login);
//VERIFY OTP
auhtorRouter.post("/authors/verify", authorControllers.verifyOTP);
//DELETE
auhtorRouter.delete(
  "/authors/:authorId",
  verifyToken,
  roleGuard("admin", "superadmin"),
  authorControllers.delete
);

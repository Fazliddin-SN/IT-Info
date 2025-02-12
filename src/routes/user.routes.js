import { Router } from "express";
import { usersControllers } from "../controllers/index.js";
import { roleGuard, verifyToken } from "../middlewares/index.js";
import { validateDate } from "../middlewares/validateMiddleware.js";
import { registerValidator } from "../validation/validators.js";
export const usersRouter = Router();

usersRouter.post(
  "/users",
  validateDate(registerValidator),
  verifyToken,
  roleGuard("superadmin"),
  usersControllers.addUser
);
// FETCH ALL USERS
usersRouter.get(
  "/users",
  verifyToken,
  roleGuard("superadmin"),
  usersControllers.fecthAllusers
);

// GET USER BY ID
usersRouter.get(
  "/users/:userId",
  verifyToken,
  roleGuard("superadmin", "admin"),
  usersControllers.getUserById
);
// UPDATE BY ID
usersRouter.put(
  "/users/:userId",
  verifyToken,
  roleGuard("superadmin"),
  usersControllers.update
);
// DELETE USER
usersRouter.delete(
  "/users/:userId",
  verifyToken,
  roleGuard("superadmin"),
  usersControllers.delete
);
// ACCESS PROFILE
usersRouter.get("/user/profile", verifyToken, usersControllers.profile);
// UPDATE PROFILE
usersRouter.put(
  "/user/profile",
  verifyToken,
  roleGuard("admin", "superadmin", "user"),
  usersControllers.updateProfile
);

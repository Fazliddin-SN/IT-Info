import { Router } from "express";
import { verifyToken, roleGuard, validateDate } from "../middlewares/index.js";
import { categoryValidator } from "../validation/categoryValidator.js";
import { categoryControllers } from "../controllers/category.controller.js";

export const categoryRouter = Router();

// CREATE NEW CATEGORY
categoryRouter.post(
  "/categories",
  validateDate(categoryValidator),
  verifyToken,
  roleGuard("admin", "superadmin"),
  categoryControllers.create
);

// GET ALL CATEGORIES
categoryRouter.get(
  "/categories",
  verifyToken,
  roleGuard("admin", "superadmin"),
  categoryControllers.getAll
);
// GET ONE BY ID
categoryRouter.get(
  "/categories/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  categoryControllers.getById
);
// UPDATE BY ID
categoryRouter.put(
  "/categories/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  categoryControllers.update
);
// DELETE BY ID
categoryRouter.delete(
  "/categories/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  categoryControllers.delete
);

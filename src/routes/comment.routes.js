import { Router } from "express";
import { commentController } from "../controllers/index.js";
import { roleGuard, verifyToken } from "../middlewares/index.js";
import { validateDate } from "../middlewares/validateMiddleware.js";
import { commentValidator } from "../validation/commentValidator.js";

export const commentRouter = Router();
//CREATE
commentRouter.post("/", verifyToken, commentController.create);
// GET ALL
commentRouter.get(
  "/",
  verifyToken,
  roleGuard("admin", "superadmin"),
  commentController.getAll
);
// GET ONE BY ID
commentRouter.get(
  "/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  commentController.getByid
);
// UPDATE ONE
commentRouter.post("/:id", verifyToken, commentController.update);
// DELETE ONE
commentRouter.delete(
  "/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  commentController.delete
);

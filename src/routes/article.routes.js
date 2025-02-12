import { Router } from "express";
import { articleControllers } from "../controllers/index.js";
import { roleGuard, verifyToken } from "../middlewares/index.js";
import { validateDate } from "../middlewares/validateMiddleware.js";
import { articleValidator } from "../validation/articleValidator.js";

export const articleRouter = Router();

// create
articleRouter.post(
  "/",
  validateDate(articleValidator),
  verifyToken,
  roleGuard("admin", "author", "superadmin"),
  articleControllers.create
);

// GET ALL
articleRouter.get(
  "/",
  verifyToken,
  roleGuard("admin", "superadmin"),
  articleControllers.getArticles
);

//GET BY ID
articleRouter.get("/:id", verifyToken, articleControllers.getById);

// Update by id
articleRouter.put(
  "/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  articleControllers.update
);

// DELETE
articleRouter.delete(
  "/:id",
  verifyToken,
  roleGuard("admin", "superadmin"),
  articleControllers.delete
);

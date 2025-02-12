import { Router } from "express";

import {
  authRouters,
  usersRouter,
  categoryRouter,
  auhtorRouter,
  articleRouter,
  commentRouter,
} from "./routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouters);
apiRouter.use("/auth", usersRouter);
apiRouter.use("/auth", categoryRouter);
apiRouter.use("/auth", auhtorRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

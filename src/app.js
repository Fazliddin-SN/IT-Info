import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { apiRouter } from "./routes/base.route.js";
// take instance and define port
const app = express();

// use dotenv and connect Database
config();
connectDB();
app.use(express.json()); // parse data

app.use((req, res, next) => {
  console.time("middleware");
  console.log({
    method: req.method,
    url: req.url,
  });

  next();
  console.timeEnd("middleware");
});
// use api endpoint
app.use("/api/v1", apiRouter);

//use error handler
app.use(errorHandler);

export default app;

import { connect } from "mongoose";

const mongodbUri =
  process.env.DATABASE_URI || "mongodb://localhost:27017/book-store";
const connectionParams = { useNewUrlParser: true };

export const connectDB = async () => {
  try {
    await connect(mongodbUri);
    console.log(`Database connected:`, connectionParams);
  } catch (error) {
    console.error(error);
  }
};

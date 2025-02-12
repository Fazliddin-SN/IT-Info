import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = model("Category", categorySchema);

import { Schema, model } from "mongoose";

const authorSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    email: {
      type: String,
      index: true,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "author",
    },
    isActive: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },
    articles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  },
  {
    timestamps: true,
  }
);

export const Author = model("Author", authorSchema);

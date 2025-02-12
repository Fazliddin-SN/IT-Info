import { model, Schema } from "mongoose";

const commentsSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    article_id: {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  },
  { timestamps: true }
);

export const Comments = model("Comments", commentsSchema);

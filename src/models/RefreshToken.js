import { model, Schema } from "mongoose";

const refreshTokenSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  token: {
    type: String,
    required: true,
    trim: true,
  },
  expires_at: {
    type: String,
  },
});

export const RefreshToken = model("RefreshToken", refreshTokenSchema);

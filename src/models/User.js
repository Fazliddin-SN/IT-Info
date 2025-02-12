import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      index: true,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
    comments: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    isActive: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Parolni saqlashdan oldin hash qilish
// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) {
// 		return next();
// 	}

// 	const salt = await genSalt(10);
// 	this.password = next();
// });

// Parolni solishtirish metodi
// userSchema.methods.matchPassword = async function (enteredPassword) {
// 	return await compare(enteredPassword, this.password);
// };

export const User = model("User", userSchema);

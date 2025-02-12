import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { authorService } from "../services/authorService.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const authorControllers = {
  // SIGN UP
  signup: catchAsync(async (req, res) => {
    const body = req.body;
    const authorData = await authorService.register(body);
    res.status(201).json({
      message: "singed up!",
      data: authorData.data,
    });
  }),
  //LOGIN
  login: catchAsync(async (req, res) => {
    // get token
    const { email, password } = req.body;
    const token = await authorService.login(email, password);
    // console.log(token);
    res.status(200).json({
      token: token,
    });
  }),

  // VERIFY OTP
  verifyOTP: catchAsync(async (req, res) => {
    const body = req.body;
    // console.log(body);

    const otpData = await authorService.verifOtp(body.authorId, body.otp);
    // console.log("otpdata: ", otpData);

    if (!otpData.success) {
      throw new ApiError(400, "Otp is not verified.Try one more!");
    }
    res.status(200).json({
      message: otpData.message,
    });
  }),
  // DELETE
  delete: catchAsync(async (req, res) => {
    const { authorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      throw new ApiError(400, "Invalid ID");
    }
    const deleted = await authorService.delete(authorId);
    //make sure user deleted

    if (!deleted.ok) {
      throw new ApiError(400, "Can not delete user!");
    }
    res.status(200).json({
      message: "User deleted successfully!",
    });
  }),
};

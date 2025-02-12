import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMail } from "../utils/heplers/email.js";
import { Author, Otp, RefreshToken } from "../models/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const authorService = {
  // SIGN UP
  async register(authorData) {
    try {
      // hashing the password
      const hashedPassword = await bcrypt.hash(authorData.password, 10);
      const author = await Author.create({
        ...authorData,
        password: hashedPassword,
      });
      if (!author) {
        throw new ApiError(400, "Can not register!");
      }
      // generate otp
      const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      // send otp to user email
      sendMail(author.email, `This is your OTP: ${otp}`);
      // save it in otp model
      const currentOtp = await Otp.create({ code: otp, user_id: author._id });
      currentOtp.save();
      return {
        data: author,
        ok: true,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // LOGIN
  async login(email, password) {
    try {
      const author = await Author.findOne({ email });
      if (!author) {
        throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);
      }
      // console.log(user.password);
      const isMatch = await bcrypt.compare(password, author.password);

      if (!isMatch) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          ERROR_MESSAGES.INVALID_CREDENTIALS
        );
      }
      /// check if user verified
      if (author.isActive !== "active") {
        throw new ApiError(400, "You must be verified");
      }

      const payload = {
        sub: author.id,
        role: author.role,
        name: author.name,
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });

      await RefreshToken.create({
        user_id: author.id,
        token: refreshToken,
        expires_at: "3d",
      });

      return { refreshToken, accessToken };
    } catch (error) {
      console.log("error: ", error);
    }
  },
  // VERIFY OTP
  async verifOtp(auhtorId, enteredOtp) {
    // console.log("userId: ", userId);

    const otp = await Otp.findOne({ code: enteredOtp });
    // console.log("otp: ", otp);

    if (!otp) {
      throw new ApiError(401, "Invalid or expired OTP");
    }
    // console.log("enteredOtp: ", enteredOtp);
    // console.log("code: ", otp.code);

    if (otp.code !== enteredOtp) {
      throw new ApiError(400, "Incorrect OTP");
    }
    await Author.findByIdAndUpdate(auhtorId, { $set: { isActive: "active" } });
    await Otp.deleteOne({ _id: otp._id });
    return { success: true, message: "OTP verified successfully" };
  },
  // DELETE USER BY ID
  async delete(auhtorId) {
    try {
      //   console.log("userid: ", userId);
      await Author.deleteOne({ _id: auhtorId });
      console.log("deleted");
      return { ok: true, message: "deleted!" };
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  },
};

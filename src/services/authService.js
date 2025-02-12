import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { sendMail } from "../utils/heplers/email.js";
import { User, RefreshToken, Otp } from "../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";
export const authService = {
  //REGISTER
  async register(userData) {
    // hashing the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({ ...userData, password: hashedPassword });
    // generate otp
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    // send otp to user email
    sendMail(user.email, `This is your OTP: ${otp}`);
    // save it in otp model
    const currentOtp = await Otp.create({ code: otp, user_id: user._id });
    currentOtp.save();
    return user;
  },
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND);
    }
    // console.log(user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }
    /// check if user verified
    if (user.isActive !== "active") {
      throw new ApiError(400, "You must be verified");
    }

    const payload = {
      sub: user.id,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: "3d",
    });

    return { refreshToken, accessToken };
  },

  refreshToken: async (refreshToken) => {
    try {
      // make sure refresh token is provided
      if (!refreshToken) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          "No refresh token is provided!"
        );
      }

      // get decoded info
      const decode = await new Promise((resolve, reject) => {
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
          (err, decoded) => {
            if (err) {
              reject(new ApiError(403, "Invalid refresh token!"));
            } else {
              resolve(decoded);
            }
          }
        );
      });
      const payload = {
        sub: decode.sub,
        role: decode.role,
        name: decode.name,
      };

      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return newAccessToken;
    } catch (error) {
      console.log({ message: error.message });
    }
  },
  async verifOtp(userId, enteredOtp) {
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
    await User.findByIdAndUpdate(userId, { $set: { isActive: "active" } });
    await Otp.deleteOne({ _id: otp._id });
    return { success: true, message: "OTP verified successfully" };
  },
};

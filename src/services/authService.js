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
    try {
      // hashing the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await User.create({ ...userData, password: hashedPassword });
      if (!user) {
        return {
          ok: false,
          sts: 400,
          msg: "Can not regitser. Something went wrong!",
        };
      }
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
      return {
        sts: 201,
        ok: true,
        msg: "registered",
        data: user,
      };
    } catch (error) {
      console.log("error: ", error.message);
      return {
        ok: false,
        sts: 500,
        msg: error.message,
      };
    }
  },
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        ok: false,
        sts: 404,
        msg: "Can not find user. Something went wrong!",
      };
    }
    // console.log(user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        ok: false,
        sts: STATUS_CODES.UNAUTHORIZED,
        msg: ERROR_MESSAGES.INVALID_CREDENTIALS,
      };
    }
    /// check if user verified
    if (user.isActive !== "active") {
      return {
        ok: false,
        msg: "You must be verified",
        sts: 400,
      };
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

    return {
      ok: true,
      sts: 200,
      refreshToken,
      accessToken,
    };
  },

  refreshToken: async (refreshToken) => {
    try {
      // make sure refresh token is provided
      if (!refreshToken) {
        return {
          sts: STATUS_CODES.UNAUTHORIZED,
          msg: "No refresh token is provided!",
          ok: false,
        };
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

      return {
        ok: true,
        sts: 200,
        newAccessToken,
      };
    } catch (error) {
      console.log({ message: error.message });
      return {
        ok: false,
        msg: error.message,
        sts: 500,
      };
    }
  },
  async verifOtp(userId, enteredOtp) {
    // console.log("userId: ", userId);
    try {
      const otp = await Otp.findOne({ code: enteredOtp });
      // console.log("otp: ", otp);

      if (!otp) {
        return {
          sts: 401,
          msg: "Invalid or expired OTP",
          ok: false,
        };
      }
      // console.log("enteredOtp: ", enteredOtp);
      // console.log("code: ", otp.code);

      if (otp.code !== enteredOtp) {
        return {
          sts: 400,
          msg: "Incorrect otp!",
          ok: false,
        };
      }
      await User.findByIdAndUpdate(userId, { $set: { isActive: "active" } });
      ///
      await Otp.deleteOne({ _id: otp._id });
      return { ok: true, sts: 200, message: "OTP verified successfully" };
    } catch (error) {
      console.log("error: ", error.message);
      return {
        ok: false,
        sts: 500,
        msg: error.message,
      };
    }
  },
};

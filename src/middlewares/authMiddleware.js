import jwt, { decode } from "jsonwebtoken";
import { Otp } from "../models/index.js";
import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader: ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided!" });
    }
    // extract token after "Bearer "
    const token = authHeader.split(" ")[1];
    // console.log("token: ", token);
    // make sure token exists

    const secret = process.env.JWT_SECRET;
    // console.log("secret: ", secret);

    jwt.verify(token, secret, (err, decoded) => {
      // check error
      if (err) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json(ERROR_MESSAGES.NO_TOKEN);
      }
      // console.log("Decoded Token : ", decoded);

      req.user = decoded; // Attach user data to request
      console.log(req.user);

      next();
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "No refresh token is provided!" });
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, decode) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token!" });
      }
      console.log("decode  : ", decode);
    }
  );

  const userId = decode.sub;
  const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(STATUS_CODES.OK).json({ accessToken: newAccessToken });
  next();
};

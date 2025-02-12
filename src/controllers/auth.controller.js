import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { authService } from "../services/authService.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const authControllers = {
  // SIGN UP
  signUp: catchAsync(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json({
      message: "Registered!",
      data: user,
    });
  }),
  // USER LOGIN
  login: catchAsync(async (req, res) => {
    // get token
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    // console.log(token);

    res.status(200).json({
      token: token,
    });
  }),
  // REFRESH TOKEN
  refreshToken: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const accessToken = await authService.refreshToken(refreshToken);
    console.log("access: ", accessToken);

    res.status(200).json({
      accessToken: accessToken,
    });
  }),
  verifyOTP: catchAsync(async (req, res) => {
    const body = req.body;
    // console.log(body);

    const otpData = await authService.verifOtp(body.userId, body.otp);
    // console.log("otpdata: ", otpData);

    if (!otpData.success) {
      throw new ApiError(400, "Otp is not verified.Try one more!");
    }
    res.status(200).json({
      message: otpData.message,
    });
  }),
};

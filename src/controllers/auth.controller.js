import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { authService } from "../services/authService.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const authControllers = {
  // SIGN UP
  signUp: catchAsync(async (req, res) => {
    const user = await authService.register(req.body);

    if (!user.ok) {
      return res.status(user.sts).json({
        msg: user.msg,
      });
    }
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

    if (!token.ok) {
      return res.status(token.sts).json({
        message: token.msg,
      });
    }
    // console.log(token);

    res.status(token.sts).json({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    });
  }),
  // REFRESH TOKEN
  refreshToken: catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const accessToken = await authService.refreshToken(refreshToken);

    if (!accessToken.ok) {
      return res.status(accessToken.sts).json({
        message: accessToken.msg,
      });
    }
    // console.log("access: ", accessToken);

    res.status(accessToken.sts).json({
      accessToken: accessToken.newAccessToken,
    });
  }),
  verifyOTP: catchAsync(async (req, res) => {
    const body = req.body;
    // console.log(body);

    const otpData = await authService.verifOtp(body.userId, body.otp);
    // console.log("otpdata: ", otpData);

    if (!otpData.ok) {
      return res.status(400).json({
        message: otpData.msg,
      });
    }
    res.status(otpData.sts).json({
      message: otpData.message,
    });
  }),
};

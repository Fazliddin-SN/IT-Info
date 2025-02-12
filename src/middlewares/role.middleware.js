import { STATUS_CODES, ERROR_MESSAGES } from "../utils/constants/index.js";

export const roleGuard = (...roles) => {
  return async (req, res, next) => {
    try {
      // console.log("roles: ", roles);

      const userRole = req.user.role;
      // console.log("role", userRole);

      if (!roles.includes(userRole)) {
        return res.status(401).json("you are not allowed to do operation!");
      }
      next();
    } catch (error) {
      console.log("error: ", error.message);

      res.status(400).json({ message: error.message });
    }
  };
};

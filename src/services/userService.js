import bcrypt, { hash } from "bcrypt";
import { User } from "../models/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";
export const usersService = {
  // ADD NEW USER
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User({ ...userData, password: hashedPassword });
    return user;
  },
  // GET ALL USERSC
  async getAllusers() {
    const users = await User.find().select("-password");
    console.log("users: ", users);

    return users;
  },
  // FETCH USE BY ID
  async getUserById(userid) {
    const user = await User.findById(userid).select("-password");
    return user;
  },
  // UPDATE USER BY ID
  async updateUser(userId, newData) {
    // hash the password
    const hashedPassword = await bcrypt.hash(newData.password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { ...newData, password: hashedPassword } },
      { new: true }
    ).select("-password");
    return updatedUser;
  },
  // DELETE USER BY ID
  async delete(userId) {
    try {
      console.log("userid: ", userId);
      await User.deleteOne({ _id: userId });
      console.log("deleted");
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
  // GET PROFILE
  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return {
        ok: false,
      };
    }
    return {
      ok: true,
      data: user,
    };
  },

  async updateOwnProfile(userId, newData) {
    try {
      if (newData.password) {
        newData.password = await bcrypt.hash(newData.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: { newData },
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        throw new ApiError(404, "User not found");
      }

      return {
        ok: true,
        data: updatedUser,
      };
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  },
};

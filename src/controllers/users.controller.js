import mongoose from "mongoose";
import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { usersService } from "../services/userService.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

import { User } from "../models/User.js";
export const usersControllers = {
  // CREATE A NEW USER
  addUser: catchAsync(async (req, res) => {
    const body = req.body;
    // prevent dublicate users
    const userExists = await User.findOne({ username: body.username });
    if (userExists) {
      return res.status(400).json("User already exists with this username");
    }
    const newUser = await usersService.createUser(body);
    // console.log("newUser: ", newUser);

    if (!newUser) {
      throw new ApiError(404, "Cannot add a new user!"); // check if user exists
    }

    newUser.save();
    res.status(201).json({
      data: newUser,
    });
  }),
  // GET ALL USERS
  fecthAllusers: catchAsync(async (req, res) => {
    const users = await usersService.getAllusers();
    if (!users) {
      throw new ApiError(404, "Can not fetch all users");
    }
    res.status(200).json({
      data: users,
    });
  }),
  //GET USER BY ID
  getUserById: catchAsync(async (req, res) => {
    const { userId } = req.params;
    // make sure id is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid ID");
    }
    const user = await usersService.getUserById(userId);
    if (!user) {
      throw new ApiError(404, "User not found!");
    }
    res.status(200).json({
      data: user,
    });
  }),
  //FIND BY ID AND UPDATE
  update: catchAsync(async (req, res) => {
    const { userId } = req.params;
    const body = req.body;
    // make sure id is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid ID");
    }
    const updatedUser = await usersService.updateUser(userId, body);

    if (!updatedUser) {
      throw new ApiError(400, "Can not update user!");
    }
    res.status(200).json({
      message: "User updated!",
    });
  }),
  // DELETE USER BY ID
  delete: catchAsync(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid ID");
    }
    const deleted = await usersService.delete(userId);
    //make sure user deleted

    if (!deleted.ok) {
      throw new ApiError(400, "Can not delete user!");
    }
    res.status(200).json({
      message: "User deleted successfully!",
    });
  }),

  profile: catchAsync(async (req, res) => {
    console.log(req.user.sub);

    const userData = await usersService.getProfile(req.user.sub);
    if (!userData.ok) {
      throw new ApiError(404, "Can not access profile. Something went wrong!");
    }
    res.status(200).json({
      data: userData.data,
    });
  }),

  updateProfile: catchAsync(async (req, res) => {
    const body = req.body;
    const updatedProfile = await usersService.updateOwnProfile(
      req.user.sub,
      body
    );
    if (!updatedProfile.ok) {
      throw new ApiError(404, "Can not update profile. Something went wrong!");
    }
    res.status(200).json({
      message: "Profile updated",
      data: updatedProfile.data,
    });
  }),
};

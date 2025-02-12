import mongoose from "mongoose";
import { Article, User, Comments } from "../models/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const commentsService = {
  //CREATE
  async create(newData) {
    try {
      const comment = await Comments.create({ ...newData });

      if (!comment) {
        return {
          ok: false,
          status: 400,
          message: "Can not create comment.Try again!",
        };
      }
      await User.findByIdAndUpdate(newData.user_id, {
        $addToSet: { comments: comment._id },
      });

      return {
        ok: true,
        data: comment,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // GET ALL
  async getAll(limit, offset) {
    try {
      const comments = await Comments.find().skip(offset).limit(limit);
      if (!comments || comments.length === 0) {
        return {
          ok: false,
          status: 404,
          message: "Can not fetch all comments. Try again",
        };
      }

      return {
        ok: true,
        data: comments,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // GET ONE BY ID
  async getOneById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          ok: false,
          status: 400,
          message: "Invalid Id!",
        };
      }
      const comment = await Comments.findById(id);

      if (!comment) {
        return {
          ok: false,
          status: 404,
          message: "Can not get comment!",
        };
      }
      return {
        ok: true,
        data: comment,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // UPDATE ONE BY ID
  async update(id, newData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          ok: false,
          status: 400,
          message: "Invalid Id!",
        };
      }

      const udpated = await Comments.findByIdAndUpdate(id, {
        $set: { ...newData },
      });

      if (!udpated) {
        return {
          ok: false,
          status: 400,
          message: "Can not update this comments!",
        };
      }
      return {
        ok: true,
        message: "Updated",
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // DELETE ONE BY ID
  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return {
          ok: false,
          status: 400,
          message: "Invalid Id!",
        };
      }

      await Comments.findByIdAndDelete(id);
      return {
        ok: true,
        message: "Deleted",
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },
};

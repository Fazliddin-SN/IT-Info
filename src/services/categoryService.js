import mongoose from "mongoose";
import { Category } from "../models/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const categoryService = {
  async createCategory(CategoryData) {
    try {
      const newCategory = await Category.create({ ...CategoryData });
      if (!newCategory) {
        throw new ApiError(400, "Can not add new category!");
      }
      return {
        ok: true,
        data: newCategory,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  async getAll() {
    try {
      const categories = await Category.find();
      if (!categories || categories.length === 0) {
        throw new ApiError(404, "Can not fetch all categories");
      }
      return {
        ok: true,
        data: categories,
      };
    } catch (error) {
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Id!");
      }
      const category = await Category.findById(id);
      if (!category) {
        throw new ApiError(404, "Can not find category with this id!");
      }
      return {
        ok: true,
        data: category,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },

  // UPDATE
  async update(id, newData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Id!");
      }
      const updatedCate = await Category.findByIdAndUpdate(id, {
        $set: { ...newData },
      });
      if (!updatedCate) {
        throw new ApiError(404, "Can not find and update category!");
      }
      return {
        ok: true,
        data: updatedCate,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // DELETE BY ID
  async delete(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Id!");
      }
      await Category.findByIdAndDelete(id);
      return {
        ok: true,
        message: "Deleted!",
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
};

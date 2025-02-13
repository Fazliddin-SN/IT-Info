import mongoose from "mongoose";
import { Article, Author } from "../models/index.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const artcileServices = {
  // ADD NEW ARTCILE
  async create(data) {
    try {
      const newArticle = await Article.create({ ...data });

      if (!newArticle) {
        return {
          ok: false,
          status: 400,
          message: "Can not create!",
        };
      }
      await newArticle.save();
      //   await newArticle
      //     .populate("category_id", "name description")
      //     .populate("athor_id", "name email")
      const author = await Author.findByIdAndUpdate(
        data.author_id,
        {
          $addToSet: { articles: newArticle._id },
        },
        { new: true }
      );

      return {
        ok: true,
        data: data,
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // GET ARTICLES
  async getArticles(limit, offset) {
    try {
      const articles = await Article.find().skip(offset).limit(limit);

      if (!articles || articles.length === 0) {
        return {
          ok: fasle,
          status: 404,
          message: "can not find articles",
        };
      }

      return {
        ok: true,
        data: articles,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // GET BY ID
  async getById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { ok: false, status: 400, message: "Invalid id" };
      }
      const article = await Article.findById(id);
      if (!article) {
        return { ok: false, status: 404, message: "Article not found!" };
      }
      return {
        ok: true,
        data: article,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: error.message,
      };
    }
  },
  // UPDATE BY ID
  async update(id, newData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { ok: false, status: 400, message: "Invalid id" };
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        {
          $set: { ...newData },
        },
        { new: true }
      );
      if (!updatedArticle) {
        return { ok: false, status: 404, message: "Can not find and update!" };
      }
      return {
        ok: true,
        message: "Updated!",
      };
    } catch (error) {
      console.log(error);
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
        return { ok: false, status: 400, message: "Invalid id" };
      }
      await Article.findByIdAndDelete(id);
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

import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { artcileServices } from "../services/articleService.js";
import { ApiError } from "../utils/errorHandler/ApiError.js";

export const articleControllers = {
  // CREATE
  create: catchAsync(async (req, res) => {
    const body = req.body;
    const data = await artcileServices.create(body);
    // make sure everything
    if (!data.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: "article created!",
      data: data.data,
    });
  }),

  // GET ARTICLES
  getArticles: catchAsync(async (req, res) => {
    const query = req.query;
    const limit = query.limit;
    const page = query.page;
    // calculate the offset based on page number and limit
    const offset = (page - 1) * limit;
    const articles = await artcileServices.getArticles(limit, offset);
    // check if there is no error
    if (!articles.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }
    // console.log(articles);

    res.status(200).json({
      data: articles.data,
    });
  }),
  // GET BY ID
  getById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const article = await artcileServices.getById(id);
    if (!article.ok) {
      return res.status(article.status).json({
        message: article.message,
      });
    }
    res.status(200).json({
      data: article.data,
    });
  }),
  // UPDATE BY ID
  update: catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const data = await artcileServices.update(id, body);
    if (!data.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
    });
  }),
  // DELETE BY ID
  delete: catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await artcileServices.delete(id);
    if (!data.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }
    res.status(200).json({
      message: data.message,
    });
  }),
};

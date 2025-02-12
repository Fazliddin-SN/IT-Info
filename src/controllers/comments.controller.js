import { catchAsync } from "../utils/errorHandler/catchAsync.js";
import { commentsService } from "../services/commentService.js";

export const commentController = {
  create: catchAsync(async (req, res) => {
    const body = req.body;
    // const userId = req.user.sub;
    // console.log(userId);

    const data = await commentsService.create(body);
    if (!data.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }
    res.status(201).json({
      message: "created!",
      data: data.data,
    });
  }),
  // Get all page limit
  getAll: catchAsync(async (req, res) => {
    const query = req.query;
    const page = query.page;
    const limit = query.limit;
    const offset = (page - 1) * limit;

    const data = await commentsService.getAll(limit, offset);
    if (!data.ok) {
      return res.status(data.status).json({
        message: data.message,
      });
    }

    res.status(200).json({
      totalResults: data.data.length,
      data: data.data,
    });
  }),
  //Update
  update: catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const updatedData = await commentsService.update(id, body);

    if (!updatedData.ok) {
      return res.status(updatedData.status).json({
        message: updatedData.message,
      });
    }

    res.status(200).json({
      message: updatedData.message,
    });
  }),
  // getOneById
  getByid: catchAsync(async (req, res) => {
    const { id } = req.params;
    const fetchedData = await commentsService.getOneById(id);
    if (!fetchedData.ok) {
      return res.status(fetchedData.status).json({
        message: fetchedData.message,
      });
    }
    res.status(200).json({
      data: fetchedData.data,
    });
  }),

  // delete by ID
  delete: catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedData = await commentsService.delete(id);
    if (!deletedData.ok) {
      return res.status(deletedData.status).json({
        message: deletedData.message,
      });
    }

    res.status(200).json({
      message: deletedData.message,
    });
  }),
};

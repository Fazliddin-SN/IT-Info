import { catchAsync, ApiError } from "../utils/errorHandler/index.js";
import { categoryService } from "../services/categoryService.js";
import { Category } from "../models/Category.js";

export const categoryControllers = {
  create: catchAsync(async (req, res) => {
    const body = req.body;
    const data = await categoryService.createCategory(body);
    res.status(201).json({
      message: "Category added!",
      data: data.data,
    });
  }),
  //GET ALL
  getAll: catchAsync(async (req, res) => {
    const data = await categoryService.getAll();
    // console.log("data", data);

    res.status(200).json({
      data: data.data,
    });
  }),
  // GET ONE BY ID
  getById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = await categoryService.getById(id);
    res.status(200).json({
      data: data.data,
    });
  }),
  // UPDATE BY ID
  update: catchAsync(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const updatedData = await categoryService.update(id, body);
    res.status(200).json({
      message: "Updated!",
      data: updatedData,
    });
  }),
  // DELETE BY ID
  delete: catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedData = await categoryService.delete(id);
    if (!deletedData.ok) {
      throw new ApiError(404, deletedData.message);
    }
    res.status(200).json({
      message: deletedData.message,
    });
  }),
};

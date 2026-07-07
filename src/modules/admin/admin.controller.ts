import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createNewCategory = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const payload = req.body;
    if (!payload.name) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid Data");
    }
    const newCategory = await adminService.createNewCategoryIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category Created Successfully",
      data: newCategory,
    });
  },
);

const gelAllCategory = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const allCategories = await adminService.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Categories Fetched",
      data: allCategories,
    });
  },
);

export const adminController = { createNewCategory, gelAllCategory };

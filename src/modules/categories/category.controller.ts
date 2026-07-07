import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryService } from "./category.service";

const gelAllCategory = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const allCategories = await categoryService.getAllCategoriesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Categories Fetched",
      data: allCategories,
    });
  },
);

export const categoryController = { gelAllCategory };

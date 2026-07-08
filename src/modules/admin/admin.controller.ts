import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createNewCategory = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const payload = req.body;
    const { name, slug } = payload;

    if (!name || typeof name !== "string") {
      throw new AppError(httpStatus.BAD_REQUEST, "Category name is required");
    }
    if (!slug || typeof slug !== "string") {
      throw new AppError(httpStatus.BAD_REQUEST, "Category slug is required");
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

const getAllUsers = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const users = await adminService.getAllUserFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Fetched",
      data: users,
    });
  },
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const updatedUser = await adminService.updateUserStatusIntoDB(
      id as string,
      req.body,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User status updated successfully",
      data: updatedUser,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const bookings = await adminService.getAllBookingsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Bookings Fetched",
      data: bookings,
    });
  },
);

export const adminController = {
  createNewCategory,
  gelAllCategory,
  getAllUsers,
  updateUserStatus,
  getAllBookings,
};

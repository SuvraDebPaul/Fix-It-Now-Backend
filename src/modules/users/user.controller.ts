import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const { name, email, password, role } = payload;

  if (!name || !email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Name, email and password are required",
    );
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide a valid email address",
    );
  }

  if (password.length < 6) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 6 characters long",
    );
  }

  if (role && !["CUSTOMER", "TECHNICIAN"].includes(role)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Role must be either CUSTOMER or TECHNICIAN",
    );
  }

  const result = await userServices.createUserIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Created Successfully",
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await userServices.getUserProfileFromDB(
    req.user?.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Profile fetched Successfully",
    data: profile,
  });
});

export const userController = { createUser, getUserProfile };

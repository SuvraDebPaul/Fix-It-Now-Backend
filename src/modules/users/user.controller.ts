import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const { name, email, password } = payload;
  if (!name && !email && password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please Provide the required data",
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

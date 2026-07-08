import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewService } from "./review.service";
import AppError from "../../errors/AppError";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { bookingId, rating } = req.body;

    if (!bookingId || typeof bookingId !== "string") {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking Id is required");
    }
    if (rating === undefined || rating === null) {
      throw new AppError(httpStatus.BAD_REQUEST, "Rating is required");
    }

    const review = await reviewService.createReviewIntoDB(req.body, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: review,
    });
  },
);

export const reviewController = { createReview };

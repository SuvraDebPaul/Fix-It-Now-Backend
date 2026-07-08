import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createPayment = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id as string;
    const { bookingId } = req.body;

    if (!bookingId || typeof bookingId !== "string") {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking Id is required");
    }

    const payment = await paymentService.createPaymentSession(req.body, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment session created successfully",
      data: payment,
    });
  },
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payment = await paymentService.confirmPayment(req.body);
    const { sessionId } = req.body;

    if (!sessionId || typeof sessionId !== "string") {
      throw new AppError(httpStatus.BAD_REQUEST, "Session Id is required");
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: payment,
    });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payments = await paymentService.getMyPaymentsFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments fetched successfully",
      data: payments,
    });
  },
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const payment = await paymentService.getPaymentByIdFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment details fetched successfully",
      data: payment,
    });
  },
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};

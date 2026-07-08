import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import AppError from "../../errors/AppError";

const createNewBooking = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const { serviceId, scheduleTime, address } = payload;

    if (!serviceId) {
      throw new AppError(status.BAD_REQUEST, "Service Id is required");
    }
    if (!scheduleTime) {
      throw new AppError(status.BAD_REQUEST, "Schedule time is required");
    }
    if (isNaN(new Date(scheduleTime).getTime())) {
      throw new AppError(
        status.BAD_REQUEST,
        "Schedule time must be a valid date",
      );
    }
    if (new Date(scheduleTime).getTime() <= Date.now()) {
      throw new AppError(
        status.BAD_REQUEST,
        "Schedule time must be in the future",
      );
    }
    if (!address || typeof address !== "string") {
      throw new AppError(status.BAD_REQUEST, "Address is required");
    }

    const newBooking = await bookingService.createNewBookingIntoDB(
      payload,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Bookings Created Succefully",
      data: newBooking,
    });
  },
);

const getCustomerBookings = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id;

    const allBooking = await bookingService.getCustomerBookingsFromDB(
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Bookings Fetched Succefully",
      data: allBooking,
    });
  },
);

const getBookingDetailsById = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const bookingDetails = await bookingService.getBookingDetailsById(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Booking Details Fetched Succefully",
      data: bookingDetails,
    });
  },
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const { cancelReason } = req.body;

    if (cancelReason && typeof cancelReason !== "string") {
      throw new AppError(
        status.BAD_REQUEST,
        "Cancel reason must be a text value",
      );
    }

    const cancelledBooking = await bookingService.cancelBookingIntoDB(
      id as string,
      userId,
      cancelReason,
    );

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  },
);

export const bookingController = {
  createNewBooking,
  getCustomerBookings,
  getBookingDetailsById,
  cancelBooking,
};

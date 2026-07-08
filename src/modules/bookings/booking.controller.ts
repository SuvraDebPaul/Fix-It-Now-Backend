import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createNewBooking = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

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

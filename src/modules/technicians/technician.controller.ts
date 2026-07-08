import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { technicianService } from "./technician.service";
import sendResponse from "../../utils/sendResponse";

const createNewService = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const { categoryId, title, description, price } = payload;

    if (!categoryId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please Select the Category");
    }

    if (!title) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please Insert a title of the service Please",
      );
    }
    const newService = await technicianService.createNewServiceIntoDB(
      payload,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service Created Successfully",
      data: newService,
    });
  },
);

const gelAllServices = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const allServices = await technicianService.getAllServicesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Services Fetched",
      data: allServices,
    });
  },
);

const getTechnicianProfile = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const { id } = req.params;

    const profile = await technicianService.getTechnicianProfileFromDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Profile Fetched",
      data: profile,
    });
  },
);

const getAllTechnician = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const allTechnician = await technicianService.getAllTechnicianFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Profile Fetched",
      data: allTechnician,
    });
  },
);

const updateTechnicianProfile = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userid = req.user?.id;
    const payload = req.body;

    const updatedProfile = await technicianService.updateTechnicianProfile(
      userid as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Profile Updated",
      data: updatedProfile,
    });
  },
);

const updateAvaiablitySlots = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.updateAvailabilityIntoDB(
      userId as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Availability updated successfully",
      data: result,
    });
  },
);

const getTechnicianBookings = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id as string;

    const bookings =
      await technicianService.getTechnicianBookingsFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician Bookings Fetched",
      data: bookings,
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, Next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;

    const updatedBooking = await technicianService.updateBookingStatusIntoDB(
      userId,
      id as string,
      req.body,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  },
);

export const technicianController = {
  createNewService,
  gelAllServices,
  getTechnicianProfile,
  getAllTechnician,
  updateTechnicianProfile,
  updateAvaiablitySlots,
  getTechnicianBookings,
  updateBookingStatus,
};

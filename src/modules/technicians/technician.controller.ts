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

export const technicianController = {
  createNewService,
  gelAllServices,
  getTechnicianProfile,
  getAllTechnician,
};

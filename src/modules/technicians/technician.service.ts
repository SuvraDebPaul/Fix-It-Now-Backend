import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import {
  IServicePayload,
  ITechnicialProfileUpdatePayload,
  IUpdateAvaiablityPayload,
  IUpdateBookingStatusPayload,
} from "./technician.interface";
import { isValidTimeFormat, timeToMinutes } from "../../utils/utils";

const createNewServiceIntoDB = async (
  payload: IServicePayload,
  userId: string,
) => {
  const { categoryId, title, description, price } = payload;

  const technicianProfile = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });
  if (!technicianProfile) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only Technicial Are allowed To Create Service",
    );
  }
  const newService = await prisma.service.create({
    data: {
      title,
      description,
      price,
      technicianProfile: {
        connect: {
          id: technicianProfile.id,
        },
      },
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
    include: {
      technicianProfile: true,
      category: true,
    },
  });

  return newService;
};

const getAllServicesFromDB = async () => {
  const allServices = await prisma.service.findMany();
  return allServices;
};

const getTechnicianProfileFromDB = async (technicialId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicialId,
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return profile;
};

const getAllTechnicianFromDB = async () => {
  const allTechnician = await prisma.technicianProfile.findMany();
  return allTechnician;
};

const updateTechnicianProfile = async (
  userId: string,
  payload: ITechnicialProfileUpdatePayload,
) => {
  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      userId,
    },
    data: {
      ...payload,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return updatedProfile;
};

const updateAvailabilityIntoDB = async (
  userId: string,
  payload: IUpdateAvaiablityPayload,
) => {
  const { slots } = payload;

  if (!Array.isArray(slots)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Slots must be an array");
  }

  slots.forEach((slot) => {
    if (!slot.day || !slot.startTime || !slot.endTime) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Day, startTime and endTime are required",
      );
    }
    if (
      !isValidTimeFormat(slot.startTime) ||
      !isValidTimeFormat(slot.endTime)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Time must be in HH:mm format. Example: 09:00",
      );
    }
    if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Start time must be before end time",
      );
    }
  });

  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });
  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: {
        technicianProfileId: technicianProfile.id,
      },
    });

    if (slots.length > 0) {
      await tx.availabilitySlot.createMany({
        data: slots.map((slot) => ({
          technicianProfileId: technicianProfile.id,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive ?? true,
        })),
      });
    }

    const updatedSlots = await tx.availabilitySlot.findMany({
      where: {
        technicianProfileId: technicianProfile.id,
      },
      orderBy: [
        {
          day: "asc",
        },
        {
          startTime: "asc",
        },
      ],
    });

    return updatedSlots;
  });

  return result;
};

const getTechnicianBookingsFromDB = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });
  if (!technicianProfile) {
    throw new AppError(httpStatus.NOT_FOUND, "Technician profile not found");
  }

  const bookings = await prisma.booking.findMany({
    where: { technicianProfileId: technicianProfile.id },
    include: {
      customerProfile: {
        include: {
          user: {
            omit: { password: true },
          },
        },
      },
      service: true,
      payment: true,
    },
  });
  return bookings;
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ["ACCEPTED", "DECLINED"],
  PAID: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
};

const updateBookingStatusIntoDB = async (
  userId: string,
  bookingId: string,
  payload: IUpdateBookingStatusPayload,
) => {
  const { status } = payload;

  if (!status) {
    throw new AppError(httpStatus.BAD_REQUEST, "Status is required");
  }

  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId },
  });

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  if (booking.technicianProfileId !== technicianProfile.id) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this booking",
    );
  }

  const allowedNextStatuses = ALLOWED_TRANSITIONS[booking.status] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change booking status from ${booking.status} to ${status}`,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      completedAt: status === "COMPLETED" ? new Date() : undefined,
    },
  });

  return updatedBooking;
};

export const technicianService = {
  createNewServiceIntoDB,
  getAllServicesFromDB,
  getTechnicianProfileFromDB,
  getAllTechnicianFromDB,
  updateTechnicianProfile,
  updateAvailabilityIntoDB,
  getTechnicianBookingsFromDB,
  updateBookingStatusIntoDB,
};

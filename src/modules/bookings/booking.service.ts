import { prisma } from "../../lib/prisma";
import { IBookingPayload } from "./booking.interface";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createNewBookingIntoDB = async (
  payload: IBookingPayload,
  userId: string,
) => {
  const { serviceId, scheduleTime, address } = payload;
  const customerProfile = await prisma.customerProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });
  if (!service.isActive) {
    throw new Error("This service is currently not available");
  }

  const newBooking = await prisma.booking.create({
    data: {
      customerProfileId: customerProfile.id,
      technicianProfileId: service.technicianProfileId,
      serviceId: service.id,
      scheduleTime,
      address,
      totalAmount: service.price,
      status: "REQUESTED",
    },
    include: {
      customerProfile: true,
      service: true,
      technicianProfile: true,
    },
  });
  return newBooking;
};

const getCustomerBookingsFromDB = async (userId: string) => {
  const customerProfile = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: {
      customerProfile: true,
    },
  });
  const customerProfileId = customerProfile?.customerProfile?.id;

  const allBookings = await prisma.booking.findMany({
    where: {
      customerProfileId,
    },
  });
  return allBookings;
};

const getBookingDetailsById = async (bookingId: string) => {
  const bookingDetails = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
  });

  return bookingDetails;
};

const cancelBookingIntoDB = async (
  bookingId: string,
  userId: string,
  cancelReason: string,
) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { customerProfile: true },
  });

  if (booking.customerProfile.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to cancel this booking",
    );
  }

  if (["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(booking.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Booking cannot be cancelled once it is ${booking.status}`,
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", cancelReason },
  });

  return updatedBooking;
};
export const bookingService = {
  createNewBookingIntoDB,
  getCustomerBookingsFromDB,
  getBookingDetailsById,
  cancelBookingIntoDB,
};

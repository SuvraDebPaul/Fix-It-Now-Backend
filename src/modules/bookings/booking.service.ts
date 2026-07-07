import { prisma } from "../../lib/prisma";
import { IBookingPayload } from "./booking.interface";

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
  if (!customerProfile) {
    throw new Error("Customer profile not found");
  }
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });
  if (!service) {
    throw new Error("Service not found");
  }

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
export const bookingService = {
  createNewBookingIntoDB,
  getCustomerBookingsFromDB,
  getBookingDetailsById,
};

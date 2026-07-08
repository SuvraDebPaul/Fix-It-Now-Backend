import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICategoryPayload, IUpdateUserStatusPayload } from "./admin.interface";

const createNewCategoryIntoDB = async (payload: ICategoryPayload) => {
  const { name, slug, description } = payload;

  const isExisting = await prisma.category.findUnique({
    where: { name, slug },
  });

  if (isExisting) {
    throw new AppError(httpStatus.CONFLICT, "Category Exists");
  }
  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });
  return newCategory;
};

const getAllCategoriesFromDB = async () => {
  const allCategories = await prisma.category.findMany();
  return allCategories;
};

const getAllUserFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    include: { customerProfile: true, technicianProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

const updateUserStatusIntoDB = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const { status } = payload;

  if (!status || !["ACTIVE", "BLOCKED"].includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Status must be either ACTIVE or BLOCKED",
    );
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
    omit: { password: true },
  });

  return updatedUser;
};

const getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      customerProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
      service: true,
      payment: true,
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return bookings;
};

export const adminService = {
  createNewCategoryIntoDB,
  getAllCategoriesFromDB,
  getAllUserFromDB,
  updateUserStatusIntoDB,
  getAllBookingsFromDB,
};

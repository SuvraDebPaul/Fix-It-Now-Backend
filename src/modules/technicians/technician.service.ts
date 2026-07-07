import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./technician.interface";

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

export const technicianService = {
  createNewServiceIntoDB,
  getAllServicesFromDB,
  getTechnicianProfileFromDB,
  getAllTechnicianFromDB,
};

import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { RegisterUser } from "./user.interface";
import httpStatus from "http-status";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";

const createUserIntoDB = async (payload: RegisterUser) => {
  const { name, email, password, role, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User Already Exists With This Email Address",
    );
  }
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      customerProfile:
        role === "CUSTOMER"
          ? {
              create: { profilePhoto },
            }
          : undefined,
      technicianProfile:
        role === "TECHNICIAN"
          ? {
              create: { profilePhoto },
            }
          : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      customerProfile: true,
      technicianProfile: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return createdUser;
};

const getUserProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      customerProfile: true,
      technicianProfile: true,
    },
  });
  return user;
};

export const userServices = { createUserIntoDB, getUserProfileFromDB };

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ILoginPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User Not Found With This Email Address",
    );
  }
  if (user.status === "BLOCKED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your Account has been Blocked, Please contact admin support",
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Authentication Does Not Match");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );
  if (!verifiedRefreshToken.success) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Token");
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (user.status === "BLOCKED") {
    throw new Error("User is Blocked");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions,
  );
  return { accessToken };
};

export const authService = { loginUser, refreshToken };

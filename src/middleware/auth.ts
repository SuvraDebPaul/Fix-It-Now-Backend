import { Request, Response, NextFunction } from "express";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { Role } from "../../generated/prisma/enums";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.toLowerCase().startsWith("bearer")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "You are not loggedin Please login to access this features",
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret as string,
      );

      if (!verifiedToken.success) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid Token");
      }

      const { id, name, email, role } = verifiedToken.data as JwtPayload;

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "Forbiden You Don't have permission to access this resource",
        );
      }

      const user = await prisma.user.findUnique({ where: { id, name, email } });

      if (!user) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "User Not Found Please Login Again",
        );
      }
      if (user.status === "BLOCKED") {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Your Account has been Blocked, Please contact admin support",
        );
      }
      req.user = {
        id,
        name,
        email,
        role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

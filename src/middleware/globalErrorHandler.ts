import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import config from "../config";

type TErrorSouce = {
  path: string;
  message: string;
};

type TGenericError = Error & {
  statusCode?: number;
  status?: string;
};

export const globalErrorHandler: ErrorRequestHandler = (
  error: TGenericError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";

  let errorSources: TErrorSouce[] = [
    {
      path: req.originalUrl,
      message,
    },
  ];

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error:
      config.node_env === "development"
        ? {
            name: error.name,
            message: error.message,
          }
        : undefined,
    stack: config.node_env === "development" ? error.stack : undefined,
  });
};

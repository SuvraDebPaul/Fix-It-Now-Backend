// src/app.ts
import express from "express";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
import { env } from "process";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  node_env: env.NODE_ENV,
  port: env.PORT,
  app_url: env.APP_URL,
  database_url: env.DATABASE_URL,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS || 12,
  jwt_access_secret: env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN || "1d",
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN || "7d",
  stripe_secret_key: env.STRIPE_SECRET_KEY
};
var config_default = config;

// src/app.ts
import cookieParser from "cookie-parser";

// src/middleware/notFound.ts
import httpStatus from "http-status";
var notFound = (req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl
  });
};

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong";
  let errorDetails = [
    {
      path: req.originalUrl,
      message
    }
  ];
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    error: config_default.node_env === "development" ? {
      name: error.name,
      message: error.message
    } : void 0,
    stack: config_default.node_env === "development" ? error.stack : void 0
  });
};

// src/modules/users/user.routes.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var catchAsync_default = catchAsync;

// src/modules/users/user.service.ts
import bcrypt from "bcryptjs";

// src/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};
var AppError_default = AppError;

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AvailabilitySlot {\n  id                  String          @id @default(uuid())\n  technicianProfileId String\n  day                 AvailabilityDay\n  startTime           String\n  endTime             String\n  isActive            Boolean         @default(true)\n  createdAt           DateTime        @default(now())\n  updatedAt           DateTime        @updatedAt\n\n  technicianProfile TechnicianProfile @relation(fields: [technicianProfileId], references: [id], onDelete: Cascade)\n\n  @@map("availability_slots")\n}\n\nmodel Booking {\n  id                  String        @id @default(uuid())\n  customerProfileId   String\n  technicianProfileId String\n  serviceId           String\n  scheduleTime        DateTime\n  address             String\n  status              BookingStatus @default(REQUESTED)\n  totalAmount         Decimal\n  cancelReason        String?\n  completedAt         DateTime?\n  createdAt           DateTime      @default(now())\n  updatedAt           DateTime      @updatedAt\n\n  customerProfile   CustomerProfile   @relation(fields: [customerProfileId], references: [id], onDelete: Cascade)\n  technicianProfile TechnicianProfile @relation(fields: [technicianProfileId], references: [id], onDelete: Cascade)\n  service           Service           @relation(fields: [serviceId], references: [id], onDelete: Cascade)\n\n  review  Review?\n  payment Payment?\n\n  @@index([customerProfileId])\n  @@map("bookings")\n}\n\nmodel Category {\n  id          String   @id @default(uuid())\n  name        String   @unique\n  slug        String   @unique\n  description String?\n  isActive    Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  services Service[]\n\n  @@map("categories")\n}\n\nmodel CustomerProfile {\n  id            String   @id @default(uuid())\n  userId        String   @unique\n  profilePhoto  String?\n  address       String?\n  city          String?\n  area          String?\n  phone         String?\n  totalBookings Int      @default(0)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bookings Booking[]\n  reviews  Review[]\n\n  @@map("customer_profiles")\n}\n\nenum Role {\n  CUSTOMER\n  TECHNICIAN\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n}\n\nenum BookingStatus {\n  REQUESTED\n  ACCEPTED\n  DECLINED\n  PAID\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n  SSLCOMMERZ\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n\nenum AvailabilityDay {\n  SATURDAY\n  SUNDAY\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n}\n\nmodel Payment {\n  id            String          @id @default(uuid())\n  bookingId     String          @unique\n  transactionId String?         @unique\n  amount        Decimal\n  provider      PaymentProvider\n  status        PaymentStatus   @default(PENDING)\n  paymentUrl    String?\n  paidAt        DateTime?\n  createdAt     DateTime        @default(now())\n  updatedAt     DateTime        @updatedAt\n\n  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@map("payments")\n}\n\nmodel Review {\n  id                  String   @id @default(uuid())\n  bookingId           String   @unique\n  customerProfileId   String\n  technicianProfileId String\n  rating              Int\n  comment             String?\n  createdAt           DateTime @default(now())\n  updatedAt           DateTime @updatedAt\n\n  booking           Booking           @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  customerProfile   CustomerProfile   @relation(fields: [customerProfileId], references: [id], onDelete: Cascade)\n  technicianProfile TechnicianProfile @relation(fields: [technicianProfileId], references: [id], onDelete: Cascade)\n\n  @@index([bookingId])\n  @@index([customerProfileId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Service {\n  id                  String   @id @default(uuid())\n  technicianProfileId String\n  categoryId          String\n  title               String\n  description         String?\n  price               Decimal  @default(0)\n  isActive            Boolean  @default(true)\n  createdAt           DateTime @default(now())\n  updatedAt           DateTime @updatedAt\n\n  technicianProfile TechnicianProfile @relation(fields: [technicianProfileId], references: [id], onDelete: Cascade)\n  category          Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  bookings Booking[]\n\n  @@map("services")\n}\n\nmodel TechnicianProfile {\n  id            String   @id @default(uuid())\n  userId        String   @unique\n  profilePhoto  String?\n  bio           String?\n  experience    Int?\n  location      String?\n  phone         String?\n  hourlyRate    Float?\n  isAvailable   Boolean  @default(true)\n  averageRating Float    @default(0)\n  totalReviews  Int      @default(0)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  user         User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  services     Service[]\n  bookings     Booking[]\n  reviews      Review[]\n  availability AvailabilitySlot[]\n\n  @@map("technician_profiles")\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  name      String\n  email     String     @unique\n  password  String\n  role      Role       @default(CUSTOMER)\n  status    UserStatus @default(ACTIVE)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  customerProfile   CustomerProfile?\n  technicianProfile TechnicianProfile?\n\n  @@map("users")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianProfileId","kind":"scalar","type":"String"},{"name":"day","kind":"enum","type":"AvailabilityDay"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"AvailabilitySlotToTechnicianProfile"}],"dbName":"availability_slots"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerProfileId","kind":"scalar","type":"String"},{"name":"technicianProfileId","kind":"scalar","type":"String"},{"name":"serviceId","kind":"scalar","type":"String"},{"name":"scheduleTime","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"cancelReason","kind":"scalar","type":"String"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerProfile","kind":"object","type":"CustomerProfile","relationName":"BookingToCustomerProfile"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"BookingToTechnicianProfile"},{"name":"service","kind":"object","type":"Service","relationName":"BookingToService"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"BookingToPayment"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"services","kind":"object","type":"Service","relationName":"CategoryToService"}],"dbName":"categories"},"CustomerProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"totalBookings","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CustomerProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToCustomerProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"CustomerProfileToReview"}],"dbName":"customer_profiles"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentUrl","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToPayment"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"customerProfileId","kind":"scalar","type":"String"},{"name":"technicianProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"customerProfile","kind":"object","type":"CustomerProfile","relationName":"CustomerProfileToReview"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"ReviewToTechnicianProfile"}],"dbName":"reviews"},"Service":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"technicianProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"ServiceToTechnicianProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToService"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToService"}],"dbName":"services"},"TechnicianProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"location","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianProfileToUser"},{"name":"services","kind":"object","type":"Service","relationName":"ServiceToTechnicianProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTechnicianProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTechnicianProfile"},{"name":"availability","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTechnicianProfile"}],"dbName":"technician_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerProfile","kind":"object","type":"CustomerProfile","relationName":"CustomerProfileToUser"},{"name":"technicianProfile","kind":"object","type":"TechnicianProfile","relationName":"TechnicianProfileToUser"}],"dbName":"users"}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","orderBy","cursor","customerProfile","technicianProfile","services","_count","category","bookings","service","booking","review","payment","reviews","availability","AvailabilitySlot.findUnique","AvailabilitySlot.findUniqueOrThrow","AvailabilitySlot.findFirst","AvailabilitySlot.findFirstOrThrow","AvailabilitySlot.findMany","data","AvailabilitySlot.createOne","AvailabilitySlot.createMany","AvailabilitySlot.createManyAndReturn","AvailabilitySlot.updateOne","AvailabilitySlot.updateMany","AvailabilitySlot.updateManyAndReturn","create","update","AvailabilitySlot.upsertOne","AvailabilitySlot.deleteOne","AvailabilitySlot.deleteMany","having","_min","_max","AvailabilitySlot.groupBy","AvailabilitySlot.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","_avg","_sum","Booking.groupBy","Booking.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","CustomerProfile.findUnique","CustomerProfile.findUniqueOrThrow","CustomerProfile.findFirst","CustomerProfile.findFirstOrThrow","CustomerProfile.findMany","CustomerProfile.createOne","CustomerProfile.createMany","CustomerProfile.createManyAndReturn","CustomerProfile.updateOne","CustomerProfile.updateMany","CustomerProfile.updateManyAndReturn","CustomerProfile.upsertOne","CustomerProfile.deleteOne","CustomerProfile.deleteMany","CustomerProfile.groupBy","CustomerProfile.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Service.findUnique","Service.findUniqueOrThrow","Service.findFirst","Service.findFirstOrThrow","Service.findMany","Service.createOne","Service.createMany","Service.createManyAndReturn","Service.updateOne","Service.updateMany","Service.updateManyAndReturn","Service.upsertOne","Service.deleteOne","Service.deleteMany","Service.groupBy","Service.aggregate","TechnicianProfile.findUnique","TechnicianProfile.findUniqueOrThrow","TechnicianProfile.findFirst","TechnicianProfile.findFirstOrThrow","TechnicianProfile.findMany","TechnicianProfile.createOne","TechnicianProfile.createMany","TechnicianProfile.createManyAndReturn","TechnicianProfile.updateOne","TechnicianProfile.updateMany","TechnicianProfile.updateManyAndReturn","TechnicianProfile.upsertOne","TechnicianProfile.deleteOne","TechnicianProfile.deleteMany","TechnicianProfile.groupBy","TechnicianProfile.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","Role","role","UserStatus","status","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","profilePhoto","bio","experience","location","phone","hourlyRate","isAvailable","averageRating","totalReviews","every","some","none","technicianProfileId","categoryId","title","description","price","isActive","bookingId","customerProfileId","rating","comment","transactionId","amount","PaymentProvider","provider","PaymentStatus","paymentUrl","paidAt","address","city","area","totalBookings","slug","serviceId","scheduleTime","BookingStatus","totalAmount","cancelReason","completedAt","AvailabilityDay","day","startTime","endTime","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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_ACAdAABEACABAAAABwAgAQAAAAUAIAcHAACkBAAgIgAApwQAICMAAKYEACA0AAClBAAgNQAAqAQAIOcBAADuAwAg6AEAAO4DACAPqAEAAMICADCpAQAATQAQqgEAAMICADCrAQEA9wEAIbIBAADDAuYBIrMBQAD6AQAhtAFAAPoBACHNAQEA9wEAIdQBAQD3AQAh3gEBAPcBACHjAQEA9wEAIeQBQAD6AQAh5gEQAKoCACHnAQEAjAIAIegBQACxAgAhAwAAAAUAIAIAAEwAMCEAAE0AIAMAAAAFACACAAAGADADAAAHACALBgAApQIAIKgBAADBAgAwqQEAAFMAEKoBAADBAgAwqwEBAAAAAawBAQAAAAGzAUAAiAIAIbQBQACIAgAh0AEBAJ4CACHSASAAoQIAIeIBAQAAAAEBAAAAUAAgAQAAAFAAIAsGAAClAgAgqAEAAMECADCpAQAAUwAQqgEAAMECADCrAQEAhQIAIawBAQCFAgAhswFAAIgCACG0AUAAiAIAIdABAQCeAgAh0gEgAKECACHiAQEAhQIAIQIGAAD3AwAg0AEAAO4DACADAAAAUwAgAgAAVAAwAwAAUAAgAwAAAFMAIAIAAFQAMAMAAFAAIAMAAABTACACAABUADADAABQACAIBgAAowQAIKsBAQAAAAGsAQEAAAABswFAAAAAAbQBQAAAAAHQAQEAAAAB0gEgAAAAAeIBAQAAAAEBFQAAWAAgB6sBAQAAAAGsAQEAAAABswFAAAAAAbQBQAAAAAHQAQEAAAAB0gEgAAAAAeIBAQAAAAEBFQAAWgAwARUAAFoAMAgGAACZBAAgqwEBANkCACGsAQEA2QIAIbMBQADcAgAhtAFAANwCACHQAQEA5AIAIdIBIADnAgAh4gEBANkCACECAAAAUAAgFQAAXQAgB6sBAQDZAgAhrAEBANkCACGzAUAA3AIAIbQBQADcAgAh0AEBAOQCACHSASAA5wIAIeIBAQDZAgAhAgAAAFMAIBUAAF8AIAIAAABTACAVAABfACADAAAAUAAgHAAAWAAgHQAAXQAgAQAAAFAAIAEAAABTACAEBwAAlgQAICIAAJgEACAjAACXBAAg0AEAAO4DACAKqAEAAMACADCpAQAAZgAQqgEAAMACADCrAQEA9wEAIawBAQD3AQAhswFAAPoBACG0AUAA-gEAIdABAQCMAgAh0gEgAI8CACHiAQEA9wEAIQMAAABTACACAABlADAhAABmACADAAAAUwAgAgAAVAAwAwAAUAAgEAEAAKQCACAJAACmAgAgDgAApwIAIKgBAAC_AgAwqQEAAAMAEKoBAAC_AgAwqwEBAAAAAbMBQACIAgAhtAFAAIgCACHAAQEAAAABwQEBAJ4CACHFAQEAngIAId4BAQCeAgAh3wEBAJ4CACHgAQEAngIAIeEBAgCjAgAhAQAAAGkAIAEAAABpACAIAQAA9gMAIAkAAPgDACAOAAD5AwAgwQEAAO4DACDFAQAA7gMAIN4BAADuAwAg3wEAAO4DACDgAQAA7gMAIAMAAAADACACAABsADADAABpACADAAAAAwAgAgAAbAAwAwAAaQAgAwAAAAMAIAIAAGwAMAMAAGkAIA0BAACVBAAgCQAA6AMAIA4AAOkDACCrAQEAAAABswFAAAAAAbQBQAAAAAHAAQEAAAABwQEBAAAAAcUBAQAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQIAAAABARUAAHAAIAqrAQEAAAABswFAAAAAAbQBQAAAAAHAAQEAAAABwQEBAAAAAcUBAQAAAAHeAQEAAAAB3wEBAAAAAeABAQAAAAHhAQIAAAABARUAAHIAMAEVAAByADANAQAAlAQAIAkAANQDACAOAADVAwAgqwEBANkCACGzAUAA3AIAIbQBQADcAgAhwAEBANkCACHBAQEA5AIAIcUBAQDkAgAh3gEBAOQCACHfAQEA5AIAIeABAQDkAgAh4QECAOkCACECAAAAaQAgFQAAdQAgCqsBAQDZAgAhswFAANwCACG0AUAA3AIAIcABAQDZAgAhwQEBAOQCACHFAQEA5AIAId4BAQDkAgAh3wEBAOQCACHgAQEA5AIAIeEBAgDpAgAhAgAAAAMAIBUAAHcAIAIAAAADACAVAAB3ACADAAAAaQAgHAAAcAAgHQAAdQAgAQAAAGkAIAEAAAADACAKBwAAjwQAICIAAJIEACAjAACRBAAgNAAAkAQAIDUAAJMEACDBAQAA7gMAIMUBAADuAwAg3gEAAO4DACDfAQAA7gMAIOABAADuAwAgDagBAAC-AgAwqQEAAH4AEKoBAAC-AgAwqwEBAPcBACGzAUAA-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-AwAgIwAA_QMAIDQAAPwDACA1AAD_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-AGwASKyAQAA-QGyASKzAUAA-gEAIbQBQAD6AQAhAwAAAOABACACAADyAQAwIQAA8wEAIAMAAADgAQAgAgAA4QEAMAMAAN0BACALqAEAAPYBADCpAQAA8wEAEKoBAAD2AQAwqwEBAPcBACGsAQEA9wEAIa0BAQD3AQAhrgEBAPcBACGwAQAA-AGwASKyAQAA-QGyASKzAUAA-gEAIbQBQAD6AQAhDgcAAPwBACAiAACDAgAgIwAAgwIAILUBAQAAAAG2AQEAAAAEtwEBAAAABLgBAQAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAggIAIb0BAQAAAAG-AQEAAAABvwEBAAAAAQcHAAD8AQAgIgAAgQIAICMAAIECACC1AQAAALABArYBAAAAsAEItwEAAACwAQi8AQAAgAKwASIHBwAA_AEAICIAAP8BACAjAAD_AQAgtQEAAACyAQK2AQAAALIBCLcBAAAAsgEIvAEAAP4BsgEiCwcAAPwBACAiAAD9AQAgIwAA_QEAILUBQAAAAAG2AUAAAAAEtwFAAAAABLgBQAAAAAG5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAA-wEAIQsHAAD8AQAgIgAA_QEAICMAAP0BACC1AUAAAAABtgFAAAAABLcBQAAAAAS4AUAAAAABuQFAAAAAAboBQAAAAAG7AUAAAAABvAFAAPsBACEItQECAAAAAbYBAgAAAAS3AQIAAAAEuAECAAAAAbkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgD8AQAhCLUBQAAAAAG2AUAAAAAEtwFAAAAABLgBQAAAAAG5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAA_QEAIQcHAAD8AQAgIgAA_wEAICMAAP8BACC1AQAAALIBArYBAAAAsgEItwEAAACyAQi8AQAA_gGyASIEtQEAAACyAQK2AQAAALIBCLcBAAAAsgEIvAEAAP8BsgEiBwcAAPwBACAiAACBAgAgIwAAgQIAILUBAAAAsAECtgEAAACwAQi3AQAAALABCLwBAACAArABIgS1AQAAALABArYBAAAAsAEItwEAAACwAQi8AQAAgQKwASIOBwAA_AEAICIAAIMCACAjAACDAgAgtQEBAAAAAbYBAQAAAAS3AQEAAAAEuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCCAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABC7UBAQAAAAG2AQEAAAAEtwEBAAAABLgBAQAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAgwIAIb0BAQAAAAG-AQEAAAABvwEBAAAAAQ0EAACJAgAgBQAAigIAIKgBAACEAgAwqQEAAOABABCqAQAAhAIAMKsBAQCFAgAhrAEBAIUCACGtAQEAhQIAIa4BAQCFAgAhsAEAAIYCsAEisgEAAIcCsgEiswFAAIgCACG0AUAAiAIAIQu1AQEAAAABtgEBAAAABLcBAQAAAAS4AQEAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAIMCACG9AQEAAAABvgEBAAAAAb8BAQAAAAEEtQEAAACwAQK2AQAAALABCLcBAAAAsAEIvAEAAIECsAEiBLUBAAAAsgECtgEAAACyAQi3AQAAALIBCLwBAAD_AbIBIgi1AUAAAAABtgFAAAAABLcBQAAAAAS4AUAAAAABuQFAAAAAAboBQAAAAAG7AUAAAAABvAFAAP0BACESAQAApAIAIAkAAKYCACAOAACnAgAgqAEAAL8CADCpAQAAAwAQqgEAAL8CADCrAQEAhQIAIbMBQACIAgAhtAFAAIgCACHAAQEAhQIAIcEBAQCeAgAhxQEBAJ4CACHeAQEAngIAId8BAQCeAgAh4AEBAJ4CACHhAQIAowIAIe0BAAADACDuAQAAAwAgFwEAAKQCACAGAAClAgAgCQAApgIAIA4AAKcCACAPAACoAgAgqAEAAJ0CADCpAQAAGQAQqgEAAJ0CADCrAQEAhQIAIbMBQACIAgAhtAFAAIgCACHAAQEAhQIAIcEBAQCeAgAhwgEBAJ4CACHDAQIAnwIAIcQBAQCeAgAhxQEBAJ4CACHGAQgAoAIAIccBIAChAgAhyAEIAKICACHJAQIAowIAIe0BAAAZACDuAQAAGQAgEKgBAACLAgAwqQEAANoBABCqAQAAiwIAMKsBAQD3AQAhswFAAPoBACG0AUAA-gEAIcABAQD3AQAhwQEBAIwCACHCAQEAjAIAIcMBAgCNAgAhxAEBAIwCACHFAQEAjAIAIcYBCACOAgAhxwEgAI8CACHIAQgAkAIAIckBAgCRAgAhDgcAAJgCACAiAACcAgAgIwAAnAIAILUBAQAAAAG2AQEAAAAFtwEBAAAABbgBAQAAAAG5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAmwIAIb0BAQAAAAG-AQEAAAABvwEBAAAAAQ0HAACYAgAgIgAAmAIAICMAAJgCACA0AACZAgAgNQAAmAIAILUBAgAAAAG2AQIAAAAFtwECAAAABbgBAgAAAAG5AQIAAAABugECAAAAAbsBAgAAAAG8AQIAmgIAIQ0HAACYAgAgIgAAmQIAICMAAJkCACA0AACZAgAgNQAAmQIAILUBCAAAAAG2AQgAAAAFtwEIAAAABbgBCAAAAAG5AQgAAAABugEIAAAAAbsBCAAAAAG8AQgAlwIAIQUHAAD8AQAgIgAAlgIAICMAAJYCACC1ASAAAAABvAEgAJUCACENBwAA_AEAICIAAJMCACAjAACTAgAgNAAAkwIAIDUAAJMCACC1AQgAAAABtgEIAAAABLcBCAAAAAS4AQgAAAABuQEIAAAAAboBCAAAAAG7AQgAAAABvAEIAJQCACENBwAA_AEAICIAAPwBACAjAAD8AQAgNAAAkwIAIDUAAPwBACC1AQIAAAABtgECAAAABLcBAgAAAAS4AQIAAAABuQECAAAAAboBAgAAAAG7AQIAAAABvAECAJICACENBwAA_AEAICIAAPwBACAjAAD8AQAgNAAAkwIAIDUAAPwBACC1AQIAAAABtgECAAAABLcBAgAAAAS4AQIAAAABuQECAAAAAboBAgAAAAG7AQIAAAABvAECAJICACEItQEIAAAAAbYBCAAAAAS3AQgAAAAEuAEIAAAAAbkBCAAAAAG6AQgAAAABuwEIAAAAAbwBCACTAgAhDQcAAPwBACAiAACTAgAgIwAAkwIAIDQAAJMCACA1AACTAgAgtQEIAAAAAbYBCAAAAAS3AQgAAAAEuAEIAAAAAbkBCAAAAAG6AQgAAAABuwEIAAAAAbwBCACUAgAhBQcAAPwBACAiAACWAgAgIwAAlgIAILUBIAAAAAG8ASAAlQIAIQK1ASAAAAABvAEgAJYCACENBwAAmAIAICIAAJkCACAjAACZAgAgNAAAmQIAIDUAAJkCACC1AQgAAAABtgEIAAAABbcBCAAAAAW4AQgAAAABuQEIAAAAAboBCAAAAAG7AQgAAAABvAEIAJcCACEItQECAAAAAbYBAgAAAAW3AQIAAAAFuAECAAAAAbkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgCYAgAhCLUBCAAAAAG2AQgAAAAFtwEIAAAABbgBCAAAAAG5AQgAAAABugEIAAAAAbsBCAAAAAG8AQgAmQIAIQ0HAACYAgAgIgAAmAIAICMAAJgCACA0AACZAgAgNQAAmAIAILUBAgAAAAG2AQIAAAAFtwECAAAABbgBAgAAAAG5AQIAAAABugECAAAAAbsBAgAAAAG8AQIAmgIAIQ4HAACYAgAgIgAAnAIAICMAAJwCACC1AQEAAAABtgEBAAAABbcBAQAAAAW4AQEAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAJsCACG9AQEAAAABvgEBAAAAAb8BAQAAAAELtQEBAAAAAbYBAQAAAAW3AQEAAAAFuAEBAAAAAbkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQCcAgAhvQEBAAAAAb4BAQAAAAG_AQEAAAABFQEAAKQCACAGAAClAgAgCQAApgIAIA4AAKcCACAPAACoAgAgqAEAAJ0CADCpAQAAGQAQqgEAAJ0CADCrAQEAhQIAIbMBQACIAgAhtAFAAIgCACHAAQEAhQIAIcEBAQCeAgAhwgEBAJ4CACHDAQIAnwIAIcQBAQCeAgAhxQEBAJ4CACHGAQgAoAIAIccBIAChAgAhyAEIAKICACHJAQIAowIAIQu1AQEAAAABtgEBAAAABbcBAQAAAAW4AQEAAAABuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAJwCACG9AQEAAAABvgEBAAAAAb8BAQAAAAEItQECAAAAAbYBAgAAAAW3AQIAAAAFuAECAAAAAbkBAgAAAAG6AQIAAAABuwECAAAAAbwBAgCYAgAhCLUBCAAAAAG2AQgAAAAFtwEIAAAABbgBCAAAAAG5AQgAAAABugEIAAAAAbsBCAAAAAG8AQgAmQIAIQK1ASAAAAABvAEgAJYCACEItQEIAAAAAbYBCAAAAAS3AQgAAAAEuAEIAAAAAbkBCAAAAAG6AQgAAAABuwEIAAAAAbwBCACTAgAhCLUBAgAAAAG2AQIAAAAEtwECAAAABLgBAgAAAAG5AQIAAAABugECAAAAAbsBAgAAAAG8AQIA_AEAIQ8EAACJAgAgBQAAigIAIKgBAACEAgAwqQEAAOABABCqAQAAhAIAMKsBAQCFAgAhrAEBAIUCACGtAQEAhQIAIa4BAQCFAgAhsAEAAIYCsAEisgEAAIcCsgEiswFAAIgCACG0AUAAiAIAIe0BAADgAQAg7gEAAOABACADygEAAAkAIMsBAAAJACDMAQAACQAgA8oBAAAFACDLAQAABQAgzAEAAAUAIAPKAQAAEAAgywEAABAAIMwBAAAQACADygEAAB4AIMsBAAAeACDMAQAAHgAgDKgBAACpAgAwqQEAAMIBABCqAQAAqQIAMKsBAQD3AQAhswFAAPoBACG0AUAA-gEAIc0BAQD3AQAhzgEBAPcBACHPAQEA9wEAIdABAQCMAgAh0QEQAKoCACHSASAAjwIAIQ0HAAD8AQAgIgAArAIAICMAAKwCACA0AACsAgAgNQAArAIAILUBEAAAAAG2ARAAAAAEtwEQAAAABLgBEAAAAAG5ARAAAAABugEQAAAAAbsBEAAAAAG8ARAAqwIAIQ0HAAD8AQAgIgAArAIAICMAAKwCACA0AACsAgAgNQAArAIAILUBEAAAAAG2ARAAAAAEtwEQAAAABLgBEAAAAAG5ARAAAAABugEQAAAAAbsBEAAAAAG8ARAAqwIAIQi1ARAAAAABtgEQAAAABLcBEAAAAAS4ARAAAAABuQEQAAAAAboBEAAAAAG7ARAAAAABvAEQAKwCACELqAEAAK0CADCpAQAArAEAEKoBAACtAgAwqwEBAPcBACGzAUAA-gEAIbQBQAD6AQAhzQEBAPcBACHTAQEA9wEAIdQBAQD3AQAh1QECAJECACHWAQEAjAIAIQ2oAQAArgIAMKkBAACWAQAQqgEAAK4CADCrAQEA9wEAIbIBAACwAtwBIrMBQAD6AQAhtAFAAPoBACHTAQEA9wEAIdcBAQCMAgAh2AEQAKoCACHaAQAArwLaASLcAQEAjAIAId0BQACxAgAhBwcAAPwBACAiAAC3AgAgIwAAtwIAILUBAAAA2gECtgEAAADaAQi3AQAAANoBCLwBAAC2AtoBIgcHAAD8AQAgIgAAtQIAICMAALUCACC1AQAAANwBArYBAAAA3AEItwEAAADcAQi8AQAAtALcASILBwAAmAIAICIAALMCACAjAACzAgAgtQFAAAAAAbYBQAAAAAW3AUAAAAAFuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQACyAgAhCwcAAJgCACAiAACzAgAgIwAAswIAILUBQAAAAAG2AUAAAAAFtwFAAAAABbgBQAAAAAG5AUAAAAABugFAAAAAAbsBQAAAAAG8AUAAsgIAIQi1AUAAAAABtgFAAAAABbcBQAAAAAW4AUAAAAABuQFAAAAAAboBQAAAAAG7AUAAAAABvAFAALMCACEHBwAA_AEAICIAALUCACAjAAC1AgAgtQEAAADcAQK2AQAAANwBCLcBAAAA3AEIvAEAALQC3AEiBLUBAAAA3AECtgEAAADcAQi3AQAAANwBCLwBAAC1AtwBIgcHAAD8AQAgIgAAtwIAICMAALcCACC1AQAAANoBArYBAAAA2gEItwEAAADaAQi8AQAAtgLaASIEtQEAAADaAQK2AQAAANoBCLcBAAAA2gEIvAEAALcC2gEiDgsAAL0CACCoAQAAuAIAMKkBAAASABCqAQAAuAIAMKsBAQCFAgAhsgEAALsC3AEiswFAAIgCACG0AUAAiAIAIdMBAQCFAgAh1wEBAJ4CACHYARAAuQIAIdoBAAC6AtoBItwBAQCeAgAh3QFAALwCACEItQEQAAAAAbYBEAAAAAS3ARAAAAAEuAEQAAAAAbkBEAAAAAG6ARAAAAABuwEQAAAAAbwBEACsAgAhBLUBAAAA2gECtgEAAADaAQi3AQAAANoBCLwBAAC3AtoBIgS1AQAAANwBArYBAAAA3AEItwEAAADcAQi8AQAAtQLcASIItQFAAAAAAbYBQAAAAAW3AUAAAAAFuAFAAAAAAbkBQAAAAAG6AUAAAAABuwFAAAAAAbwBQACzAgAhFgQAAM4CACAFAADMAgAgCgAA0wIAIAwAANQCACANAADVAgAgqAEAANECADCpAQAABQAQqgEAANECADCrAQEAhQIAIbIBAADSAuYBIrMBQACIAgAhtAFAAIgCACHNAQEAhQIAIdQBAQCFAgAh3gEBAIUCACHjAQEAhQIAIeQBQACIAgAh5gEQALkCACHnAQEAngIAIegBQAC8AgAh7QEAAAUAIO4BAAAFACANqAEAAL4CADCpAQAAfgAQqgEAAL4CADCrAQEA9wEAIbMBQAD6AQAhtAFAAPoBACHAAQEA9wEAIcEBAQCMAgAhxQEBAIwCACHeAQEAjAIAId8BAQCMAgAh4AEBAIwCACHhAQIAkQIAIRABAACkAgAgCQAApgIAIA4AAKcCACCoAQAAvwIAMKkBAAADABCqAQAAvwIAMKsBAQCFAgAhswFAAIgCACG0AUAAiAIAIcABAQCFAgAhwQEBAJ4CACHFAQEAngIAId4BAQCeAgAh3wEBAJ4CACHgAQEAngIAIeEBAgCjAgAhCqgBAADAAgAwqQEAAGYAEKoBAADAAgAwqwEBAPcBACGsAQEA9wEAIbMBQAD6AQAhtAFAAPoBACHQAQEAjAIAIdIBIACPAgAh4gEBAPcBACELBgAApQIAIKgBAADBAgAwqQEAAFMAEKoBAADBAgAwqwEBAIUCACGsAQEAhQIAIbMBQACIAgAhtAFAAIgCACHQAQEAngIAIdIBIAChAgAh4gEBAIUCACEPqAEAAMICADCpAQAATQAQqgEAAMICADCrAQEA9wEAIbIBAADDAuYBIrMBQAD6AQAhtAFAAPoBACHNAQEA9wEAIdQBAQD3AQAh3gEBAPcBACHjAQEA9wEAIeQBQAD6AQAh5gEQAKoCACHnAQEAjAIAIegBQACxAgAhBwcAAPwBACAiAADFAgAgIwAAxQIAILUBAAAA5gECtgEAAADmAQi3AQAAAOYBCLwBAADEAuYBIgcHAAD8AQAgIgAAxQIAICMAAMUCACC1AQAAAOYBArYBAAAA5gEItwEAAADmAQi8AQAAxALmASIEtQEAAADmAQK2AQAAAOYBCLcBAAAA5gEIvAEAAMUC5gEiC6gBAADGAgAwqQEAADcAEKoBAADGAgAwqwEBAPcBACGzAUAA-gEAIbQBQAD6AQAhzQEBAPcBACHSASAAjwIAIeoBAADHAuoBIusBAQD3AQAh7AEBAPcBACEHBwAA_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-wIAMB0AAIADADDvAQAA_AIAMPABAAD9AgAw8QEAAP8CADDyAQAA_wIAMPMBAAD_AgAw9AEAAP4CACD1AQAA_wIAMPYBAACBAwAw9wEAAIIDADALHAAA7gIAMB0AAPMCADDvAQAA7wIAMPABAADwAgAw8QEAAPICADDyAQAA8gIAMPMBAADyAgAw9AEAAPECACD1AQAA8gIAMPYBAAD0AgAw9wEAAPUCADAHqwEBAAAAAbMBQAAAAAG0AUAAAAAB0gEgAAAAAeoBAAAA6gEC6wEBAAAAAewBAQAAAAECAAAAAQAgHAAA-gIAIAMAAAABACAcAAD6AgAgHQAA-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_wIAMPQBAAD-AgAgBBwAAO4CADDvAQAA7wIAMPMBAADyAgAw9AEAAPECACALCQAA6AMAIA4AAOkDACCrAQEAAAABswFAAAAAAbQBQAAAAAHBAQEAAAABxQEBAAAAAd4BAQAAAAHfAQEAAAAB4AEBAAAAAeEBAgAAAAECAAAAaQAgHAAAzwMAIAMAAAADACAcAADPAwAgHQAA0wMAIA0AAAADACAJAADUAwAgDgAA1QMAIBUAANMDACCrAQEA2QIAIbMBQADcAgAhtAFAANwCACHBAQEA5AIAIcUBAQDkAgAh3gEBAOQCACHfAQEA5AIAIeABAQDkAgAh4QECAOkCACELCQAA1AMAIA4AANUDACCrAQEA2QIAIbMBQADcAgAhtAFAANwCACHBAQEA5AIAIcUBAQDkAgAh3gEBAOQCACHfAQEA5AIAIeABAQDkAgAh4QECAOkCACELHAAA3wMAMB0AAOMDADDvAQAA4AMAMPABAADhAwAw8QEAAI8DADDyAQAAjwMAMPMBAACPAwAw9AEAAOIDACD1AQAAjwMAMPYBAADkAwAw9wEAAJIDADALHAAA1gMAMB0AANoDADDvAQAA1wMAMPABAADYAwAw8QEAAP8CADDyAQAA_wIAMPMBAAD_AgAw9AEAANkDACD1AQAA_wIAMPYBAADbAwAw9wEAAIIDADAJBQAAqgMAIAsAAIkDACCrAQEAAAABswFAAAAAAbQBQAAAAAHNAQEAAAAB0wEBAAAAAdUBAgAAAAHWAQEAAAABAgAAABUAIBwAAN4DACADAAAAFQAgHAAA3gMAIB0AAN0DACABFQAAzQQAMAIAAAAVACAVAADdAwAgAgAAAIMDACAVAADcAwAgB6sBAQDZAgAhswFAANwCACG0AUAA3AIAIc0BAQDZAgAh0wEBANkCACHVAQIA6QIAIdYBAQDkAgAhCQUAAKkDACALAACGAwAgqwEBANkCACGzAUAA3AIAIbQBQADcAgAhzQEBANkCACHTAQEA2QIAIdUBAgDpAgAh1gEBAOQCACEJBQAAqgMAIAsAAIkDACCrAQEAAAABswFAAAAAAbQBQAAAAAHNAQEAAAAB0wEBAAAAAdUBAgAAAAHWAQEAAAABDwUAAMcDACAKAACtAwAgDAAArgMAIA0AAK8DACCrAQEAAAABsgEAAADmAQKzAUAAAAABtAFAAAAAAc0BAQAAAAHeAQEAAAAB4wEBAAAAAeQBQAAAAAHmARAAAAAB5wEBAAAAAegBQAAAAAECAAAABwAgHAAA5wMAIAMAAAAHACAcAADnAwAgHQAA5gMAIAEVAADMBAAwAgAAAAcAIBUAAOYDACACAAAAkwMAIBUAAOUDACALqwEBANkCACGyAQAAlQPmASKzAUAA3AIAIbQBQADcAgAhzQEBANkCACHeAQEA2QIAIeMBAQDZAgAh5AFAANwCACHmARAAlgMAIecBAQDkAgAh6AFAAJcDACEPBQAAxQMAIAoAAJoDACAMAACbAwAgDQAAnAMAIKsBAQDZAgAhsgEAAJUD5gEiswFAANwCACG0AUAA3AIAIc0BAQDZAgAh3gEBANkCACHjAQEA2QIAIeQBQADcAgAh5gEQAJYDACHnAQEA5AIAIegBQACXAwAhDwUAAMcDACAKAACtAwAgDAAArgMAIA0AAK8DACCrAQEAAAABsgEAAADmAQKzAUAAAAABtAFAAAAAAc0BAQAAAAHeAQEAAAAB4wEBAAAAAeQBQAAAAAHmARAAAAAB5wEBAAAAAegBQAAAAAEEHAAA3wMAMO8BAADgAwAw8wEAAI8DADD0AQAA4gMAIAQcAADWAwAw7wEAANcDADDzAQAA_wIAMPQBAADZAwAgAxwAAM8DACDvAQAA0AMAIPMBAABpACADHAAA3wIAIO8BAADgAgAg8wEAAMUBACAIAQAA9gMAIAkAAPgDACAOAAD5AwAgwQEAAO4DACDFAQAA7gMAIN4BAADuAwAg3wEAAO4DACDgAQAA7gMAIAsBAAD2AwAgBgAA9wMAIAkAAPgDACAOAAD5AwAgDwAA-gMAIMEBAADuAwAgwgEAAO4DACDDAQAA7gMAIMQBAADuAwAgxQEAAO4DACDGAQAA7gMAIAAAAAAAAAUcAADHBAAgHQAAygQAIO8BAADIBAAg8AEAAMkEACDzAQAA3QEAIAMcAADHBAAg7wEAAMgEACDzAQAA3QEAIAIEAADsAwAgBQAA7QMAIAAAAAAAAAAAAAUcAADCBAAgHQAAxQQAIO8BAADDBAAg8AEAAMQEACDzAQAAxQEAIAMcAADCBAAg7wEAAMMEACDzAQAAxQEAIAAAAAAAAAAAAAAFHAAAvQQAIB0AAMAEACDvAQAAvgQAIPABAAC_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-IwA_NAA8NQA9AAAAAAAFBwA7IgA-IwA_NAA8NQA9AgUAAggABwIFAAIIAAcFBwBEIgBHIwBINABFNQBGAAAAAAAFBwBEIgBHIwBINABFNQBGAQEAAwEBAAMFBwBNIgBQIwBRNABONQBPAAAAAAAFBwBNIgBQIwBRNABONQBPAAADBwBWIgBXIwBYAAAAAwcAViIAVyMAWBACARElARImARMnARQoARYqARcsDhgtDxkvARoxDhsyEB4zAR80ASA1DiQ4ESU5FSY6BSc7BSg8BSk9BSo-BStABSxCDi1DFi5FBS9HDjBIFzFJBTJKBTNLDjZOGDdPHjhRBzlSBzpVBztWBzxXBz1ZBz5bDj9cH0BeB0FgDkJhIENiB0RjB0VkDkZnIUdoJUhqBElrBEptBEtuBExvBE1xBE5zDk90JlB2BFF4DlJ5J1N6BFR7BFV8DlZ_KFeAAS5YggELWYMBC1qFAQtbhgELXIcBC12JAQteiwEOX4wBL2COAQthkAEOYpEBMGOSAQtkkwELZZQBDmaXATFnmAE3aJkBCmmaAQpqmwEKa5wBCmydAQptnwEKbqEBDm-iAThwpAEKcaYBDnKnATlzqAEKdKkBCnWqAQ52rQE6d64BQHivAQZ5sAEGerEBBnuyAQZ8swEGfbUBBn63AQ5_uAFBgAG6AQaBAbwBDoIBvQFCgwG-AQaEAb8BBoUBwAEOhgHDAUOHAcQBSYgBxgECiQHHAQKKAckBAosBygECjAHLAQKNAc0BAo4BzwEOjwHQAUqQAdIBApEB1AEOkgHVAUuTAdYBApQB1wEClQHYAQ6WAdsBTJcB3AFSmAHeAQOZAd8BA5oB4gEDmwHjAQOcAeQBA50B5gEDngHoAQ6fAekBU6AB6wEDoQHtAQ6iAe4BVKMB7wEDpAHwAQOlAfEBDqYB9AFVpwH1AVk"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/users/user.service.ts
import httpStatus2 from "http-status";
var createUserIntoDB = async (payload) => {
  const { name, email, password, role, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isUserExist) {
    throw new AppError_default(
      httpStatus2.CONFLICT,
      "User Already Exists With This Email Address"
    );
  }
  const hashPassword = await bcrypt.hash(
    password,
    Number(config_default.bcrypt_salt_rounds)
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      customerProfile: role === "CUSTOMER" ? {
        create: { profilePhoto }
      } : void 0,
      technicianProfile: role === "TECHNICIAN" ? {
        create: { profilePhoto }
      } : void 0
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
      updatedAt: true
    }
  });
  return createdUser;
};
var getUserProfileFromDB = async (userId) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      customerProfile: true,
      technicianProfile: true
    }
  });
  return user;
};
var userServices = { createUserIntoDB, getUserProfileFromDB };

// src/modules/users/user.controller.ts
import httpStatus3 from "http-status";

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};
var sendResponse_default = sendResponse;

// src/modules/users/user.controller.ts
var createUser = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const { name, email, password, role } = payload;
  if (!name || !email || !password) {
    throw new AppError_default(
      httpStatus3.BAD_REQUEST,
      "Name, email and password are required"
    );
  }
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    throw new AppError_default(
      httpStatus3.BAD_REQUEST,
      "Please provide a valid email address"
    );
  }
  if (password.length < 6) {
    throw new AppError_default(
      httpStatus3.BAD_REQUEST,
      "Password must be at least 6 characters long"
    );
  }
  if (role && !["CUSTOMER", "TECHNICIAN"].includes(role)) {
    throw new AppError_default(
      httpStatus3.BAD_REQUEST,
      "Role must be either CUSTOMER or TECHNICIAN"
    );
  }
  const result = await userServices.createUserIntoDB(payload);
  sendResponse_default(res, {
    statusCode: httpStatus3.CREATED,
    success: true,
    message: "User Created Successfully",
    data: result
  });
});
var getUserProfile = catchAsync_default(async (req, res) => {
  const profile = await userServices.getUserProfileFromDB(
    req.user?.id
  );
  sendResponse_default(res, {
    success: true,
    statusCode: httpStatus3.OK,
    message: "User Profile fetched Successfully",
    data: profile
  });
});
var userController = { createUser, getUserProfile };

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  const verifiedToken = jwt.verify(token, secret);
  return {
    success: true,
    data: verifiedToken
  };
};
var jwtUtils = { createToken, verifyToken };

// src/middleware/auth.ts
import httpStatus4 from "http-status";
var auth = (...requiredRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.toLowerCase().startsWith("bearer") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new AppError_default(
          httpStatus4.BAD_REQUEST,
          "You are not loggedin Please login to access this features"
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config_default.jwt_access_secret
      );
      if (!verifiedToken.success) {
        throw new AppError_default(httpStatus4.BAD_REQUEST, "Invalid Token");
      }
      const { id, name, email, role } = verifiedToken.data;
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError_default(
          httpStatus4.FORBIDDEN,
          "Forbiden You Don't have permission to access this resource"
        );
      }
      const user = await prisma.user.findUnique({ where: { id, name, email } });
      if (!user) {
        throw new AppError_default(
          httpStatus4.BAD_REQUEST,
          "User Not Found Please Login Again"
        );
      }
      if (user.status === "BLOCKED") {
        throw new AppError_default(
          httpStatus4.BAD_REQUEST,
          "Your Account has been Blocked, Please contact admin support"
        );
      }
      req.user = {
        id,
        name,
        email,
        role
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/users/user.routes.ts
var router = Router();
router.post("/register", userController.createUser);
router.get(
  "/me",
  auth("ADMIN", "CUSTOMER", "TECHNICIAN"),
  userController.getUserProfile
);
var userRoutes = router;
var user_routes_default = userRoutes;

// src/modules/auth/auth.routes.ts
import { Router as Router2 } from "express";

// src/modules/auth/auth.service.ts
import httpStatus5 from "http-status";
import bcrypt2 from "bcryptjs";
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError_default(
      httpStatus5.NOT_FOUND,
      "User Not Found With This Email Address"
    );
  }
  if (user.status === "BLOCKED") {
    throw new AppError_default(
      httpStatus5.BAD_REQUEST,
      "Your Account has been Blocked, Please contact admin support"
    );
  }
  const validPassword = await bcrypt2.compare(password, user.password);
  if (!validPassword) {
    throw new AppError_default(httpStatus5.BAD_REQUEST, "Authentication Does Not Match");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return { accessToken, refreshToken: refreshToken3 };
};
var refreshToken = async (refreshToken3) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken3,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success) {
    throw new AppError_default(httpStatus5.BAD_REQUEST, "Invalid Token");
  }
  const { id } = verifiedRefreshToken.data;
  const user = await prisma.user.findUniqueOrThrow({ where: { id } });
  if (user.status === "BLOCKED") {
    throw new Error("User is Blocked");
  }
  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  return { accessToken };
};
var authService = { loginUser, refreshToken };

// src/modules/auth/auth.controller.ts
import httpStatus6 from "http-status";
var loginUser2 = catchAsync_default(
  async (req, res, next) => {
    const payload = req.body;
    const { email, password } = payload;
    if (!email || !password) {
      throw new AppError_default(
        httpStatus6.BAD_REQUEST,
        "Email and password are required"
      );
    }
    const { accessToken, refreshToken: refreshToken3 } = await authService.loginUser(payload);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
    });
    res.cookie("refreshToken", refreshToken3, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 7
    });
    sendResponse_default(res, {
      statusCode: httpStatus6.OK,
      success: true,
      message: "Login Successful",
      data: { accessToken, refreshToken: refreshToken3 }
    });
  }
);
var refreshToken2 = catchAsync_default(
  async (req, res, next) => {
    const refreshToken3 = req.cookies.refreshToken;
    const { accessToken } = await authService.refreshToken(refreshToken3);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24
    });
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus6.OK,
      message: "Token Refreshed Successfully",
      data: { accessToken }
    });
  }
);
var authController = { loginUser: loginUser2, refreshToken: refreshToken2 };

// src/modules/auth/auth.routes.ts
var router2 = Router2();
router2.post("/login", authController.loginUser);
router2.post("/refresh-token", authController.refreshToken);
var authRoutes = router2;
var auth_routes_default = authRoutes;

// src/modules/admin/admin.routes.ts
import { Router as Router3 } from "express";

// src/modules/admin/admin.service.ts
import httpStatus7 from "http-status";
var createNewCategoryIntoDB = async (payload) => {
  const { name, slug, description } = payload;
  const isExisting = await prisma.category.findUnique({
    where: { name, slug }
  });
  if (isExisting) {
    throw new AppError_default(httpStatus7.CONFLICT, "Category Exists");
  }
  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
      description
    }
  });
  return newCategory;
};
var getAllCategoriesFromDB = async () => {
  const allCategories = await prisma.category.findMany();
  return allCategories;
};
var getAllUserFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    include: { customerProfile: true, technicianProfile: true },
    orderBy: { createdAt: "desc" }
  });
  return users;
};
var updateUserStatusIntoDB = async (userId, payload) => {
  const { status: status2 } = payload;
  if (!status2 || !["ACTIVE", "BLOCKED"].includes(status2)) {
    throw new AppError_default(
      httpStatus7.BAD_REQUEST,
      "Status must be either ACTIVE or BLOCKED"
    );
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: status2 },
    omit: { password: true }
  });
  return updatedUser;
};
var getAllBookingsFromDB = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      customerProfile: {
        include: {
          user: {
            omit: {
              password: true
            }
          }
        }
      },
      technicianProfile: {
        include: {
          user: {
            omit: {
              password: true
            }
          }
        }
      },
      service: true,
      payment: true,
      review: true
    },
    orderBy: { createdAt: "desc" }
  });
  return bookings;
};
var adminService = {
  createNewCategoryIntoDB,
  getAllCategoriesFromDB,
  getAllUserFromDB,
  updateUserStatusIntoDB,
  getAllBookingsFromDB
};

// src/modules/admin/admin.controller.ts
import httpStatus8 from "http-status";
var createNewCategory = catchAsync_default(
  async (req, res, Next) => {
    const payload = req.body;
    const { name, slug } = payload;
    if (!name || typeof name !== "string") {
      throw new AppError_default(httpStatus8.BAD_REQUEST, "Category name is required");
    }
    if (!slug || typeof slug !== "string") {
      throw new AppError_default(httpStatus8.BAD_REQUEST, "Category slug is required");
    }
    const newCategory = await adminService.createNewCategoryIntoDB(payload);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "Category Created Successfully",
      data: newCategory
    });
  }
);
var gelAllCategory = catchAsync_default(
  async (req, res, Next) => {
    const allCategories = await adminService.getAllCategoriesFromDB();
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "All Categories Fetched",
      data: allCategories
    });
  }
);
var getAllUsers = catchAsync_default(
  async (req, res, Next) => {
    const users = await adminService.getAllUserFromDB();
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "All Users Fetched",
      data: users
    });
  }
);
var updateUserStatus = catchAsync_default(
  async (req, res, Next) => {
    const { id } = req.params;
    const updatedUser = await adminService.updateUserStatusIntoDB(
      id,
      req.body
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "User status updated successfully",
      data: updatedUser
    });
  }
);
var getAllBookings = catchAsync_default(
  async (req, res, Next) => {
    const bookings = await adminService.getAllBookingsFromDB();
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus8.OK,
      message: "All Bookings Fetched",
      data: bookings
    });
  }
);
var adminController = {
  createNewCategory,
  gelAllCategory,
  getAllUsers,
  updateUserStatus,
  getAllBookings
};

// src/modules/admin/admin.routes.ts
var router3 = Router3();
router3.post("/categories", auth("ADMIN"), adminController.createNewCategory);
router3.get("/categories", adminController.gelAllCategory);
router3.get("/users", auth("ADMIN"), adminController.getAllUsers);
router3.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);
router3.get("/bookings", auth("ADMIN"), adminController.getAllBookings);
var adminRoutes = router3;
var admin_routes_default = adminRoutes;

// src/modules/categories/category.routes.ts
import { Router as Router4 } from "express";

// src/modules/categories/category.controller.ts
import httpStatus9 from "http-status";

// src/modules/categories/category.service.ts
var getAllCategoriesFromDB2 = async () => {
  const allCategories = await prisma.category.findMany();
  return allCategories;
};
var categoryService = { getAllCategoriesFromDB: getAllCategoriesFromDB2 };

// src/modules/categories/category.controller.ts
var gelAllCategory2 = catchAsync_default(
  async (req, res, Next) => {
    const allCategories = await categoryService.getAllCategoriesFromDB();
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "All Categories Fetched",
      data: allCategories
    });
  }
);
var categoryController = { gelAllCategory: gelAllCategory2 };

// src/modules/categories/category.routes.ts
var router4 = Router4();
router4.get("/categories", categoryController.gelAllCategory);
var categoryRoutes = router4;

// src/modules/technicians/technician.routes.ts
import { Router as Router5 } from "express";

// src/modules/technicians/technician.controller.ts
import httpStatus11 from "http-status";

// src/modules/technicians/technician.service.ts
import httpStatus10 from "http-status";

// src/utils/utils.ts
var isValidTimeFormat = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};
var timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// src/modules/technicians/technician.service.ts
var createNewServiceIntoDB = async (payload, userId) => {
  const { categoryId, title, description, price } = payload;
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId }
  });
  if (!technicianProfile) {
    throw new AppError_default(
      httpStatus10.FORBIDDEN,
      "Only Technicial Are allowed To Create Service"
    );
  }
  const newService = await prisma.service.create({
    data: {
      title,
      description,
      price,
      technicianProfile: {
        connect: {
          id: technicianProfile.id
        }
      },
      category: {
        connect: {
          id: categoryId
        }
      }
    },
    include: {
      technicianProfile: true,
      category: true
    }
  });
  return newService;
};
var getAllServicesFromDB = async (filters) => {
  const { categoryId, location, minPrice, maxPrice, minRating } = filters;
  const allServices = await prisma.service.findMany({
    where: {
      isActive: true,
      ...categoryId && { categoryId },
      ...(minPrice || maxPrice) && {
        price: {
          ...minPrice && { gte: Number(minPrice) },
          ...maxPrice && { lte: Number(maxPrice) }
        }
      },
      technicianProfile: {
        ...location && {
          location: { contains: location, mode: "insensitive" }
        },
        ...minRating && { averageRating: { gte: Number(minRating) } }
      }
    },
    include: {
      technicianProfile: true,
      category: true
    }
  });
  return allServices;
};
var getTechnicianProfileFromDB = async (technicialId) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicialId
    },
    include: {
      reviews: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return profile;
};
var getAllTechnicianFromDB = async (filters) => {
  const { location, minRating, isAvailable, categoryId } = filters;
  const allTechnician = await prisma.technicianProfile.findMany({
    where: {
      ...location && {
        location: { contains: location, mode: "insensitive" }
      },
      ...minRating && { averageRating: { gte: Number(minRating) } },
      ...isAvailable !== void 0 && {
        isAvailable: isAvailable === "true"
      },
      ...categoryId && { services: { some: { categoryId } } }
    },
    include: {
      user: { omit: { password: true } },
      services: true
    }
  });
  return allTechnician;
};
var updateTechnicianProfile = async (userId, payload) => {
  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      userId
    },
    data: {
      ...payload
    },
    include: {
      user: {
        omit: {
          password: true
        }
      }
    }
  });
  return updatedProfile;
};
var updateAvailabilityIntoDB = async (userId, payload) => {
  const { slots } = payload;
  if (!Array.isArray(slots)) {
    throw new AppError_default(httpStatus10.BAD_REQUEST, "Slots must be an array");
  }
  slots.forEach((slot) => {
    if (!slot.day || !slot.startTime || !slot.endTime) {
      throw new AppError_default(
        httpStatus10.BAD_REQUEST,
        "Day, startTime and endTime are required"
      );
    }
    if (!isValidTimeFormat(slot.startTime) || !isValidTimeFormat(slot.endTime)) {
      throw new AppError_default(
        httpStatus10.BAD_REQUEST,
        "Time must be in HH:mm format. Example: 09:00"
      );
    }
    if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
      throw new AppError_default(
        httpStatus10.BAD_REQUEST,
        "Start time must be before end time"
      );
    }
  });
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId
    }
  });
  if (!technicianProfile) {
    throw new AppError_default(httpStatus10.NOT_FOUND, "Technician profile not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.availabilitySlot.deleteMany({
      where: {
        technicianProfileId: technicianProfile.id
      }
    });
    if (slots.length > 0) {
      await tx.availabilitySlot.createMany({
        data: slots.map((slot) => ({
          technicianProfileId: technicianProfile.id,
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive ?? true
        }))
      });
    }
    const updatedSlots = await tx.availabilitySlot.findMany({
      where: {
        technicianProfileId: technicianProfile.id
      },
      orderBy: [
        {
          day: "asc"
        },
        {
          startTime: "asc"
        }
      ]
    });
    return updatedSlots;
  });
  return result;
};
var getTechnicianBookingsFromDB = async (userId) => {
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!technicianProfile) {
    throw new AppError_default(httpStatus10.NOT_FOUND, "Technician profile not found");
  }
  const bookings = await prisma.booking.findMany({
    where: { technicianProfileId: technicianProfile.id },
    include: {
      customerProfile: {
        include: {
          user: {
            omit: { password: true }
          }
        }
      },
      service: true,
      payment: true
    }
  });
  return bookings;
};
var ALLOWED_TRANSITIONS = {
  REQUESTED: ["ACCEPTED", "DECLINED"],
  PAID: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"]
};
var updateBookingStatusIntoDB = async (userId, bookingId, payload) => {
  const { status: status2 } = payload;
  if (!status2) {
    throw new AppError_default(httpStatus10.BAD_REQUEST, "Status is required");
  }
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: { userId }
  });
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId }
  });
  if (booking.technicianProfileId !== technicianProfile.id) {
    throw new AppError_default(
      httpStatus10.FORBIDDEN,
      "You are not allowed to update this booking"
    );
  }
  const allowedNextStatuses = ALLOWED_TRANSITIONS[booking.status] || [];
  if (!allowedNextStatuses.includes(status2)) {
    throw new AppError_default(
      httpStatus10.BAD_REQUEST,
      `Cannot change booking status from ${booking.status} to ${status2}`
    );
  }
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: status2,
      completedAt: status2 === "COMPLETED" ? /* @__PURE__ */ new Date() : void 0
    }
  });
  return updatedBooking;
};
var technicianService = {
  createNewServiceIntoDB,
  getAllServicesFromDB,
  getTechnicianProfileFromDB,
  getAllTechnicianFromDB,
  updateTechnicianProfile,
  updateAvailabilityIntoDB,
  getTechnicianBookingsFromDB,
  updateBookingStatusIntoDB
};

// src/modules/technicians/technician.controller.ts
var createNewService = catchAsync_default(
  async (req, res, Next) => {
    const id = req.user?.id;
    const payload = req.body;
    const { categoryId, title, description, price } = payload;
    if (!categoryId) {
      throw new AppError_default(httpStatus11.BAD_REQUEST, "Please Select the Category");
    }
    if (!title) {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "Please Insert a title of the service Please"
      );
    }
    const newService = await technicianService.createNewServiceIntoDB(
      payload,
      id
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.CREATED,
      message: "Service Created Successfully",
      data: newService
    });
  }
);
var gelAllServices = catchAsync_default(
  async (req, res, Next) => {
    const allServices = await technicianService.getAllServicesFromDB(req.query);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "All Services Fetched",
      data: allServices
    });
  }
);
var getTechnicianProfile = catchAsync_default(
  async (req, res, Next) => {
    const { id } = req.params;
    const profile = await technicianService.getTechnicianProfileFromDB(
      id
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Technician Profile Fetched",
      data: profile
    });
  }
);
var getAllTechnician = catchAsync_default(
  async (req, res, Next) => {
    const allTechnician = await technicianService.getAllTechnicianFromDB(
      req.query
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Technician Profile Fetched",
      data: allTechnician
    });
  }
);
var updateTechnicianProfile2 = catchAsync_default(
  async (req, res, Next) => {
    const userid = req.user?.id;
    const payload = req.body;
    const updatedProfile = await technicianService.updateTechnicianProfile(
      userid,
      payload
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Technician Profile Updated",
      data: updatedProfile
    });
  }
);
var updateAvaiablitySlots = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const result = await technicianService.updateAvailabilityIntoDB(
      userId,
      req.body
    );
    sendResponse_default(res, {
      statusCode: httpStatus11.OK,
      success: true,
      message: "Availability updated successfully",
      data: result
    });
  }
);
var getTechnicianBookings = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const bookings = await technicianService.getTechnicianBookingsFromDB(userId);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Technician Bookings Fetched",
      data: bookings
    });
  }
);
var updateBookingStatus = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const payload = req.body;
    const { experience, hourlyRate, isAvailable } = payload;
    if (experience !== void 0 && (typeof experience !== "number" || experience < 0)) {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "Experience must be a positive number"
      );
    }
    if (hourlyRate !== void 0 && (typeof hourlyRate !== "number" || hourlyRate < 0)) {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "Hourly rate must be a positive number"
      );
    }
    if (isAvailable !== void 0 && typeof isAvailable !== "boolean") {
      throw new AppError_default(
        httpStatus11.BAD_REQUEST,
        "isAvailable must be true or false"
      );
    }
    const updatedBooking = await technicianService.updateBookingStatusIntoDB(
      userId,
      id,
      payload
    );
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus11.OK,
      message: "Booking status updated successfully",
      data: updatedBooking
    });
  }
);
var technicianController = {
  createNewService,
  gelAllServices,
  getTechnicianProfile,
  getAllTechnician,
  updateTechnicianProfile: updateTechnicianProfile2,
  updateAvaiablitySlots,
  getTechnicianBookings,
  updateBookingStatus
};

// src/modules/technicians/technician.routes.ts
var router5 = Router5();
router5.post(
  "/technicians/services",
  auth(Role.TECHNICIAN),
  technicianController.createNewService
);
router5.get("/services", technicianController.gelAllServices);
router5.get("/technicians", technicianController.getAllTechnician);
router5.get("/technicians/:id", technicianController.getTechnicianProfile);
router5.put(
  "/technician/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateTechnicianProfile
);
router5.put(
  "/technician/availability",
  auth(Role.TECHNICIAN),
  technicianController.updateAvaiablitySlots
);
router5.get(
  "/technician/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getTechnicianBookings
);
router5.patch(
  "/technician/bookings/:id",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus
);
var technicianRoutes = router5;

// src/modules/bookings/booking.routes.ts
import { Router as Router6 } from "express";

// src/modules/bookings/booking.service.ts
import httpStatus12 from "http-status";
var createNewBookingIntoDB = async (payload, userId) => {
  const { serviceId, scheduleTime, address } = payload;
  const customerProfile = await prisma.customerProfile.findUniqueOrThrow({
    where: {
      userId
    }
  });
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId
    }
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
      status: "REQUESTED"
    },
    include: {
      customerProfile: true,
      service: true,
      technicianProfile: true
    }
  });
  return newBooking;
};
var getCustomerBookingsFromDB = async (userId) => {
  const customerProfile = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
    include: {
      customerProfile: true
    }
  });
  const customerProfileId = customerProfile?.customerProfile?.id;
  const allBookings = await prisma.booking.findMany({
    where: {
      customerProfileId
    }
  });
  return allBookings;
};
var getBookingDetailsById = async (bookingId) => {
  const bookingDetails = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId }
  });
  return bookingDetails;
};
var cancelBookingIntoDB = async (bookingId, userId, cancelReason) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { customerProfile: true }
  });
  if (booking.customerProfile.userId !== userId) {
    throw new AppError_default(
      httpStatus12.FORBIDDEN,
      "You are not allowed to cancel this booking"
    );
  }
  if (["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(booking.status)) {
    throw new AppError_default(
      httpStatus12.BAD_REQUEST,
      `Booking cannot be cancelled once it is ${booking.status}`
    );
  }
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", cancelReason }
  });
  return updatedBooking;
};
var bookingService = {
  createNewBookingIntoDB,
  getCustomerBookingsFromDB,
  getBookingDetailsById,
  cancelBookingIntoDB
};

// src/modules/bookings/booking.controller.ts
import status from "http-status";
var createNewBooking = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const payload = req.body;
    const { serviceId, scheduleTime, address } = payload;
    if (!serviceId) {
      throw new AppError_default(status.BAD_REQUEST, "Service Id is required");
    }
    if (!scheduleTime) {
      throw new AppError_default(status.BAD_REQUEST, "Schedule time is required");
    }
    if (isNaN(new Date(scheduleTime).getTime())) {
      throw new AppError_default(
        status.BAD_REQUEST,
        "Schedule time must be a valid date"
      );
    }
    if (new Date(scheduleTime).getTime() <= Date.now()) {
      throw new AppError_default(
        status.BAD_REQUEST,
        "Schedule time must be in the future"
      );
    }
    if (!address || typeof address !== "string") {
      throw new AppError_default(status.BAD_REQUEST, "Address is required");
    }
    const newBooking = await bookingService.createNewBookingIntoDB(
      payload,
      userId
    );
    sendResponse_default(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Bookings Created Succefully",
      data: newBooking
    });
  }
);
var getCustomerBookings = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const allBooking = await bookingService.getCustomerBookingsFromDB(
      userId
    );
    sendResponse_default(res, {
      success: true,
      statusCode: status.OK,
      message: "Bookings Fetched Succefully",
      data: allBooking
    });
  }
);
var getBookingDetailsById2 = catchAsync_default(
  async (req, res, Next) => {
    const { id } = req.params;
    const bookingDetails = await bookingService.getBookingDetailsById(
      id
    );
    sendResponse_default(res, {
      success: true,
      statusCode: status.OK,
      message: "Booking Details Fetched Succefully",
      data: bookingDetails
    });
  }
);
var cancelBooking = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const { cancelReason } = req.body;
    if (cancelReason && typeof cancelReason !== "string") {
      throw new AppError_default(
        status.BAD_REQUEST,
        "Cancel reason must be a text value"
      );
    }
    const cancelledBooking = await bookingService.cancelBookingIntoDB(
      id,
      userId,
      cancelReason
    );
    sendResponse_default(res, {
      success: true,
      statusCode: status.OK,
      message: "Booking cancelled successfully",
      data: cancelledBooking
    });
  }
);
var bookingController = {
  createNewBooking,
  getCustomerBookings,
  getBookingDetailsById: getBookingDetailsById2,
  cancelBooking
};

// src/modules/bookings/booking.routes.ts
var router6 = Router6();
router6.post(
  "/bookings",
  auth(Role.CUSTOMER),
  bookingController.createNewBooking
);
router6.get(
  "/bookings",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.getCustomerBookings
);
router6.get(
  "/bookings/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getBookingDetailsById
);
router6.patch(
  "/bookings/:id/cancel",
  auth(Role.CUSTOMER),
  bookingController.cancelBooking
);
var bookingRoutes = router6;

// src/modules/payments/payment.routes.ts
import { Router as Router7 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/modules/payments/payment.service.ts
import httpStatus13 from "http-status";
var createPaymentSession = async (payload, userId) => {
  const { bookingId } = payload;
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId
    },
    include: {
      customerProfile: true,
      service: true,
      payment: true
    }
  });
  if (booking.customerProfile.userId !== userId) {
    throw new AppError_default(
      httpStatus13.FORBIDDEN,
      "You are not allowed to pay for this booking"
    );
  }
  if (booking.status !== "ACCEPTED") {
    throw new AppError_default(
      httpStatus13.BAD_REQUEST,
      "Booking must be accepted by the technician before payment"
    );
  }
  if (booking.payment) {
    throw new AppError_default(
      httpStatus13.CONFLICT,
      "Payment already initiated for this booking"
    );
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.service.title },
          unit_amount: Math.round(Number(booking.totalAmount) * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${config_default.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config_default.app_url}/payment-cancel`
  });
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      transactionId: session.id,
      amount: booking.totalAmount,
      provider: "STRIPE",
      status: "PENDING",
      paymentUrl: session.url
    }
  });
  return payment;
};
var confirmPayment = async (payload) => {
  const { sessionId } = payload;
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      transactionId: sessionId
    }
  });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new AppError_default(httpStatus13.BAD_REQUEST, "Payment not completed yet");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatePayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", paidAt: /* @__PURE__ */ new Date() }
    });
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "PAID" }
    });
    return updatePayment;
  });
  return result;
};
var getMyPaymentsFromDB = async (userId) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerProfile: {
          userId
        }
      }
    },
    include: {
      booking: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return payments;
};
var getPaymentByIdFromDB = async (paymentId) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { booking: true }
  });
  return payment;
};
var paymentService = {
  createPaymentSession,
  confirmPayment,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB
};

// src/modules/payments/payment.controller.ts
import httpStatus14 from "http-status";
var createPayment = catchAsync_default(
  async (req, res, Next) => {
    const userId = req.user?.id;
    const { bookingId } = req.body;
    if (!bookingId || typeof bookingId !== "string") {
      throw new AppError_default(httpStatus14.BAD_REQUEST, "Booking Id is required");
    }
    const payment = await paymentService.createPaymentSession(req.body, userId);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus14.CREATED,
      message: "Payment session created successfully",
      data: payment
    });
  }
);
var confirmPayment2 = catchAsync_default(
  async (req, res, next) => {
    const payment = await paymentService.confirmPayment(req.body);
    const { sessionId } = req.body;
    if (!sessionId || typeof sessionId !== "string") {
      throw new AppError_default(httpStatus14.BAD_REQUEST, "Session Id is required");
    }
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus14.OK,
      message: "Payment confirmed successfully",
      data: payment
    });
  }
);
var getMyPayments = catchAsync_default(
  async (req, res, next) => {
    const userId = req.user?.id;
    const payments = await paymentService.getMyPaymentsFromDB(userId);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus14.OK,
      message: "Payments fetched successfully",
      data: payments
    });
  }
);
var getPaymentById = catchAsync_default(
  async (req, res, next) => {
    const { id } = req.params;
    const payment = await paymentService.getPaymentByIdFromDB(id);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus14.OK,
      message: "Payment details fetched successfully",
      data: payment
    });
  }
);
var paymentController = {
  createPayment,
  confirmPayment: confirmPayment2,
  getMyPayments,
  getPaymentById
};

// src/modules/payments/payment.routes.ts
var router7 = Router7();
router7.post(
  "/payments/create",
  auth(Role.CUSTOMER),
  paymentController.createPayment
);
router7.post("/payments/confirm", paymentController.confirmPayment);
router7.get(
  "/payments",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getMyPayments
);
router7.get(
  "/payments/:id",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  paymentController.getPaymentById
);
var paymentRoutes = router7;

// src/modules/reviews/review.routes.ts
import { Router as Router8 } from "express";

// src/modules/reviews/review.controller.ts
import httpStatus16 from "http-status";

// src/modules/reviews/review.service.ts
import httpStatus15 from "http-status";
var createReviewIntoDB = async (payload, userId) => {
  const { bookingId, rating, comment } = payload;
  if (!rating || rating < 1 || rating > 5) {
    throw new AppError_default(
      httpStatus15.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { customerProfile: true, review: true }
  });
  if (booking.customerProfile.userId !== userId) {
    throw new AppError_default(
      httpStatus15.FORBIDDEN,
      "You are not allowed to review this booking"
    );
  }
  if (booking.status !== "COMPLETED") {
    throw new AppError_default(
      httpStatus15.BAD_REQUEST,
      "You can only review a completed booking"
    );
  }
  if (booking.review) {
    throw new AppError_default(
      httpStatus15.CONFLICT,
      "You have already reviewed this booking"
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId: booking.id,
        customerProfileId: booking.customerProfileId,
        technicianProfileId: booking.technicianProfileId,
        rating,
        comment
      }
    });
    const aggregate = await tx.review.aggregate({
      where: { technicianProfileId: booking.technicianProfileId },
      _avg: { rating: true },
      _count: { rating: true }
    });
    await tx.technicianProfile.update({
      where: { id: booking.technicianProfileId },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count.rating
      }
    });
    return review;
  });
  return result;
};
var reviewService = { createReviewIntoDB };

// src/modules/reviews/review.controller.ts
var createReview = catchAsync_default(
  async (req, res, next) => {
    const userId = req.user?.id;
    const { bookingId, rating } = req.body;
    if (!bookingId || typeof bookingId !== "string") {
      throw new AppError_default(httpStatus16.BAD_REQUEST, "Booking Id is required");
    }
    if (rating === void 0 || rating === null) {
      throw new AppError_default(httpStatus16.BAD_REQUEST, "Rating is required");
    }
    const review = await reviewService.createReviewIntoDB(req.body, userId);
    sendResponse_default(res, {
      success: true,
      statusCode: httpStatus16.CREATED,
      message: "Review created successfully",
      data: review
    });
  }
);
var reviewController = { createReview };

// src/modules/reviews/review.routes.ts
var router8 = Router8();
router8.post("/reviews", auth(Role.CUSTOMER), reviewController.createReview);
var reviewRoutes = router8;

// src/app.ts
var app = express();
app.use(cors({ origin: config_default.app_url, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Fix It Now Server Running");
});
app.get("/api", (req, res) => {
  res.send("Fix It Now API is Running");
});
app.get("/payment-success", (req, res) => {
  const { session_id } = req.query;
  res.send(`
    <h2>Payment completed</h2>
    <p>Copy this session ID into <code>POST /api/payments/confirm</code>:</p>
    <pre>${session_id}</pre>
  `);
});
app.get("/payment-cancel", (req, res) => {
  res.send("<h2>Payment was cancelled.</h2>");
});
app.use("/api", categoryRoutes);
app.use("/api/auth", user_routes_default);
app.use("/api/auth", auth_routes_default);
app.use("/api", technicianRoutes);
app.use("/api", bookingRoutes);
app.use("/api/admin", admin_routes_default);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};

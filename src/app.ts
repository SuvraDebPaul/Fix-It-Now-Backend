import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { categoryRoutes } from "./modules/categories/category.routes";
import { technicianRoutes } from "./modules/technicians/technician.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { reviewRoutes } from "./modules/reviews/review.routes";

const app: Application = express();

app.use(cors({ origin: config.app_url, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Fix It Now Server Running");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("Fix It Now API is Running");
});

app.use("/api", categoryRoutes);

app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api", technicianRoutes);
app.use("/api", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api", paymentRoutes);

app.use("/api", reviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;

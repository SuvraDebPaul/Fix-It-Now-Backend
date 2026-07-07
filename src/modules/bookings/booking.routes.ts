import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/bookings",
  auth(Role.CUSTOMER),
  bookingController.createNewBooking,
);
router.get(
  "/bookings",
  auth(Role.CUSTOMER, Role.ADMIN),
  bookingController.getCustomerBookings,
);
router.get("/bookings/:id", bookingController.getBookingDetailsById);
export const bookingRoutes = router;

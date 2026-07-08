import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/payments/create",
  auth(Role.CUSTOMER),
  paymentController.createPayment,
);
router.post("/payments/confirm", paymentController.confirmPayment);
router.get(
  "/payments",
  auth(Role.CUSTOMER, Role.ADMIN),
  paymentController.getMyPayments,
);
router.get(
  "/payments/:id",
  auth(Role.CUSTOMER, Role.ADMIN, Role.TECHNICIAN),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;

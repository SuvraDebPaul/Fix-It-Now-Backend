import { Router } from "express";
import { technicianController } from "./technician.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/technicians/services", technicianController.createNewService);
router.get("/services", technicianController.gelAllServices);
router.get("/technicians", technicianController.getAllTechnician);
router.get("/technicians/:id", technicianController.getTechnicianProfile);

router.put(
  "/technician/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateTechnicianProfile,
);
router.put(
  "/technician/availability",
  auth(Role.TECHNICIAN),
  technicianController.updateAvaiablitySlots,
);
router.get("/technician/bookings", auth(Role.TECHNICIAN));
router.patch("/technician/bookings/:id", auth(Role.TECHNICIAN));

router.get("/technician/bookings", auth(Role.TECHNICIAN));
router.patch("/technician/bookings/:id", auth(Role.TECHNICIAN));

export const technicianRoutes = router;

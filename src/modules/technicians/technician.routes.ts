import { Router } from "express";
import { technicianController } from "./technician.controller";

const router = Router();

router.post("/technicians/services", technicianController.createNewService);
router.get("/services", technicianController.gelAllServices);
router.get("/technicians", technicianController.getAllTechnician);
router.get("/technicians/:id", technicianController.getTechnicianProfile);

export const technicianRoutes = router;

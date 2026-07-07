import { Router } from "express";
import { technicianController } from "./technician.controller";

const router = Router();

router.post("/technicians/services", technicianController.createNewService);
router.get("/services", technicianController.gelAllServices);

export const technicianRoutes = router;

import { Router } from "express";
import { auth } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.post("/categories", auth("ADMIN"), adminController.createNewCategory);
router.get("/categories", adminController.gelAllCategory);

router.get("/users", auth("ADMIN"), adminController.getAllUsers);
router.patch("/users/:id", auth("ADMIN"), adminController.updateUserStatus);
router.get("/bookings", auth("ADMIN"), adminController.getAllBookings);

const adminRoutes = router;

export default adminRoutes;

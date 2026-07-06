import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/register", userController.createUser);
router.get(
  "/me",
  auth("ADMIN", "CUSTOMER", "TECHNICIAN"),
  userController.getUserProfile,
);

const userRoutes = router;

export default userRoutes;

import { Router } from "express";
import { auth } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.post("/categories", auth("ADMIN"), adminController.createNewCategory);
router.get("/categories", adminController.gelAllCategory);

const adminRoutes = router;

export default adminRoutes;

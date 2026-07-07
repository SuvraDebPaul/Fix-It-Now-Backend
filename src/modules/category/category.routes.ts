import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/categories", categoryController.gelAllCategory);

export const categoryRoutes = router;

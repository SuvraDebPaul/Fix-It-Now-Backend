import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICategoryPayload } from "./admin.interface";

const createNewCategoryIntoDB = async (payload: ICategoryPayload) => {
  const { name, slug, description } = payload;

  const isExisting = await prisma.category.findUnique({
    where: { name, slug },
  });

  if (isExisting) {
    throw new AppError(httpStatus.CONFLICT, "Category Exists");
  }
  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });
  return newCategory;
};

const getAllCategoriesFromDB = async () => {
  const allCategories = await prisma.category.findMany();
  return allCategories;
};

export const adminService = { createNewCategoryIntoDB, getAllCategoriesFromDB };

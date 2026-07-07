import { prisma } from "../../lib/prisma";

const getAllCategoriesFromDB = async () => {
  const allCategories = await prisma.category.findMany();
  return allCategories;
};

export const categoryService = { getAllCategoriesFromDB };

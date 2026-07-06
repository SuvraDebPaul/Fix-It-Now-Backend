/*
  Warnings:

  - You are about to drop the column `profilePhoto` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer_profiles" ADD COLUMN     "profilePhoto" TEXT;

-- AlterTable
ALTER TABLE "technician_profiles" ADD COLUMN     "profilePhoto" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePhoto";

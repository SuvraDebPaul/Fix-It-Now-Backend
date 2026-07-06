/*
  Warnings:

  - You are about to drop the column `customerId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `technicianId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `technicianId` on the `reviews` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the column `technicanId` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `tittle` on the `services` table. All the data in the column will be lost.
  - Added the required column `customerProfileId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicianProfileId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerProfileId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicianProfileId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicianProfileId` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customerId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_technicianId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_technicanId_fkey";

-- DropIndex
DROP INDEX "bookings_customerId_key";

-- DropIndex
DROP INDEX "bookings_serviceId_key";

-- DropIndex
DROP INDEX "bookings_technicianId_key";

-- DropIndex
DROP INDEX "reviews_customerId_key";

-- DropIndex
DROP INDEX "reviews_technicianId_key";

-- DropIndex
DROP INDEX "services_categoryId_key";

-- DropIndex
DROP INDEX "services_technicanId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "customerId",
DROP COLUMN "technicianId",
ADD COLUMN     "customerProfileId" TEXT NOT NULL,
ADD COLUMN     "technicianProfileId" TEXT NOT NULL,
ALTER COLUMN "completedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerId",
DROP COLUMN "technicianId",
ADD COLUMN     "customerProfileId" TEXT NOT NULL,
ADD COLUMN     "technicianProfileId" TEXT NOT NULL,
ALTER COLUMN "rating" DROP DEFAULT,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "technicanId",
DROP COLUMN "tittle",
ADD COLUMN     "technicianProfileId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "customer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "customer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

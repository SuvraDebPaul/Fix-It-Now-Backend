-- CreateEnum
CREATE TYPE "AvailabilityDay" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "technicianProfileId" TEXT NOT NULL,
    "day" "AvailabilityDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bookings_customerProfileId_idx" ON "bookings"("customerProfileId");

-- CreateIndex
CREATE INDEX "reviews_bookingId_idx" ON "reviews"("bookingId");

-- CreateIndex
CREATE INDEX "reviews_customerProfileId_idx" ON "reviews"("customerProfileId");

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_technicianProfileId_fkey" FOREIGN KEY ("technicianProfileId") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

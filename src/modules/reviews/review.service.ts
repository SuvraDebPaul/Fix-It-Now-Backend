import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";
import httpStatus from "http-status";

const createReviewIntoDB = async (
  payload: ICreateReviewPayload,
  userId: string,
) => {
  const { bookingId, rating, comment } = payload;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { customerProfile: true, review: true },
  });

  if (booking.customerProfile.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to review this booking",
    );
  }
  if (booking.status !== "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only review a completed booking",
    );
  }
  if (booking.review) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already reviewed this booking",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId: booking.id,
        customerProfileId: booking.customerProfileId,
        technicianProfileId: booking.technicianProfileId,
        rating,
        comment,
      },
    });
    const aggregate = await tx.review.aggregate({
      where: { technicianProfileId: booking.technicianProfileId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await tx.technicianProfile.update({
      where: { id: booking.technicianProfileId },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        totalReviews: aggregate._count.rating,
      },
    });
    return review;
  });

  return result;
};

export const reviewService = { createReviewIntoDB };

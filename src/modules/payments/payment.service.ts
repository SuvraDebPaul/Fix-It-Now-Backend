import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import httpStatus from "http-status";
import {
  IConfirmPaymentPayload,
  ICreatePaymentPayload,
} from "./payment.interface";

const createPaymentSession = async (
  payload: ICreatePaymentPayload,
  userId: string,
) => {
  const { bookingId } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      customerProfile: true,
      service: true,
      payment: true,
    },
  });

  if (booking.customerProfile.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to pay for this booking",
    );
  }
  if (booking.status !== "ACCEPTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking must be accepted by the technician before payment",
    );
  }

  if (booking.payment) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Payment already initiated for this booking",
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.service.title },
          unit_amount: Math.round(Number(booking.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment-cancel`,
  });

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      transactionId: session.id,
      amount: booking.totalAmount,
      provider: "STRIPE",
      status: "PENDING",
      paymentUrl: session.url,
    },
  });

  return payment;
};

const confirmPayment = async (payload: IConfirmPaymentPayload) => {
  const { sessionId } = payload;
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      transactionId: sessionId,
    },
  });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment not completed yet");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatePayment = await tx.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", paidAt: new Date() },
    });
    await tx.booking.update({
      where: { id: payment.bookingId },
      data: { status: "PAID" },
    });

    return updatePayment;
  });

  return result;
};

const getMyPaymentsFromDB = async (userId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerProfile: {
          userId,
        },
      },
    },
    include: {
      booking: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

const getPaymentByIdFromDB = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { booking: true },
  });

  return payment;
};

export const paymentService = {
  createPaymentSession,
  confirmPayment,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};

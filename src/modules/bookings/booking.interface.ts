import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBookingPayload {
  scheduleTime: Date;
  serviceId: string;
  address: string;
  status: BookingStatus;
  cancelReason?: string;
  completedAt?: Date;
}
export interface ICancelBookingPayload {
  cancelReason?: string;
}

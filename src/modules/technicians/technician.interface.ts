export interface IServicePayload {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
}

export interface ITechnicialProfileUpdatePayload {
  profilePhoto?: string;
  bio?: string;
  experience?: number;
  location?: string;
  phone?: string;
  hourlyRate?: number;
  isAvailable?: boolean;
}

export interface isAvailabilitySlot {
  day:
    | "SATURDAY"
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY";
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface IUpdateAvaiablityPayload {
  slots: isAvailabilitySlot[];
}

export interface IUpdateBookingStatusPayload {
  status: "ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED";
}

export interface IServiceFilters {
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
}

export interface ITechnicianFilters {
  location?: string;
  minRating?: string;
  isAvailable?: string;
  categoryId?: string;
}

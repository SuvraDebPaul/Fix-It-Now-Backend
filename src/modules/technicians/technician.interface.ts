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

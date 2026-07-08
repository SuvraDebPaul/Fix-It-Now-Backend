export interface ICategoryPayload {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface IUpdateUserStatusPayload {
  status: "ACTIVE" | "BLOCKED";
}

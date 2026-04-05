export type LoginFormValues = {
  email: string;
  password: string;
};

import { z } from "zod";
import type { ChurchResponse } from "./payload";

export const churchIdentitySchema = z.object({
  name: z.string().min(1, "Church name is required"),
  alias: z.string().optional(),
  address: z.string().min(1, "Church address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  defaultCurrency: z.string().min(1, "Default currency is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  file: z.any().optional(),
});

export type ChurchIdentityValues = z.infer<typeof churchIdentitySchema>;

export const uploadMembersSchema = z.object({
  csvFile: z.instanceof(File).optional(),
});

export type UploadMembersValues = z.infer<typeof uploadMembersSchema>;

export const weeklyServiceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  days: z.array(z.string()).min(1, "At least one day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
});

export type WeeklyServiceValues = z.infer<typeof weeklyServiceSchema>;

export const weeklyServicesArraySchema = z.array(weeklyServiceSchema);

export type WeeklyServicesValues = WeeklyServiceValues[];

export const churchResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  alias: z.string().optional(),
  address: z.string(),
  country: z.string(),
  state: z.string().optional(),
  defaultCurrency: z.string(),
  timeZone: z.string(),
  logoUrl: z.string().optional(),
  logoPublicId: z.string().optional(),
});

export function parseChurchResponse(payload: unknown): ChurchResponse | null {
  const parsed = churchResponseSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

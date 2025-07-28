import { Gender } from "./patientTypes";
import { z } from "zod";

export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string()
});

export const newDiagnosesSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional()
})
import { z } from "zod";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

// diagnoses 
export const newDiagnosesSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional()
})

//patient entry
export const baseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});
export const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string()
  })
});
export const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string()
  }).optional()
});
export const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.enum(HealthCheckRating) // HealthCheckRating enum
});
// no-id versions
const hospitalEntryNewSchema = hospitalEntrySchema.omit({ id: true });
const occupationalHealthcareEntryNewSchema = occupationalHealthcareEntrySchema.omit({ id: true });
const healthCheckEntryNewSchema = healthCheckEntrySchema.omit({ id: true });

// union of all patient entry schemas
export const entrySchema = z.discriminatedUnion("type", [hospitalEntrySchema, occupationalHealthcareEntrySchema, healthCheckEntrySchema]);
// Union for new entries
export const newEntrySchema = z.discriminatedUnion("type", [hospitalEntryNewSchema, occupationalHealthcareEntryNewSchema, healthCheckEntryNewSchema]);

// patient
export const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender), // Gender enum
  occupation: z.string(),
  entries: z.array(entrySchema) // the union of different patient entry schemas
});
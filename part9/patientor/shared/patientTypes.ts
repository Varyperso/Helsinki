import { z } from "zod";
import { newDiagnosesSchema, entrySchema, newPatientSchema, hospitalEntrySchema, occupationalHealthcareEntrySchema, healthCheckEntrySchema, baseEntrySchema } from "../backend/src/patientUtils";

// helper to remove field/s from unions
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

// diagnoses
export type DiagnosesEntry = z.infer<typeof newDiagnosesSchema>;

// patient entry
export type baseEntry = z.infer<typeof baseEntrySchema>
export type HospitalEntry = z.infer<typeof hospitalEntrySchema>;
export type OccupationalHealthcareEntry = z.infer<typeof occupationalHealthcareEntrySchema>;
export type HealthCheckEntry = z.infer<typeof healthCheckEntrySchema>;

export type Entry = z.infer<typeof entrySchema>; // union of HealthCheckEntry | OccupationalHealthcareEntry | HospitalEntry
export type NewEntry = UnionOmit<Entry, 'id'>

// patient
export type NewPatientEntry = z.infer<typeof newPatientSchema>;
export interface PatientEntry extends NewPatientEntry { id: string; }
export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn' | 'entries'>;
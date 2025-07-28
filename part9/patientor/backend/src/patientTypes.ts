import { z } from "zod";
import { newDiagnosesSchema, newPatientSchema } from "./patientUtils";

export type DiagnosesEntry = z.infer<typeof newDiagnosesSchema>;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}
export type NewPatientEntry = z.infer<typeof newPatientSchema>;
export interface PatientEntry extends NewPatientEntry {
  id: string;
}
export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;
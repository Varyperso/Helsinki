import patientsEntries from "../../data/patientEntries";
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry, NewEntry } from "../../../shared/patientTypes";
import { v4 as uuidv4 } from 'uuid';

const getPatientEntries = () => patientsEntries;

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patientsEntries.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }));
} 

const findById = (id: string): PatientEntry | undefined => patientsEntries.find(p => p.id === id);

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = { id: uuidv4(), ...entry };
  patientsEntries.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: NewEntry, patientId: string) => {
  const newEntry = { id: uuidv4(), ...entry }
  const patient = patientsEntries.find(p => p.id === patientId)

  if (!patient) return null

  patient.entries.push(newEntry)
  return newEntry
}

export default { getPatientEntries, getNonSensitivePatientEntries, findById, addPatient, addEntry };
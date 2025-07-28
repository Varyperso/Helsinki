import patientsEntries from "../../data/patientEntries";
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry } from "../patientTypes";
import { v4 as uuidv4 } from 'uuid';

const getPatientEntries = () => patientsEntries;
const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => 
  patientsEntries.map(({ id, name, dateOfBirth, gender, occupation }) => ({ id, name, dateOfBirth, gender, occupation }));
const findById = (id: string): PatientEntry | undefined => patientsEntries.find(p => p.id === id);

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = { id: uuidv4(), ...entry };
  patientsEntries.push(newPatientEntry);
  return newPatientEntry;
};

export default { getPatientEntries, getNonSensitivePatientEntries, findById, addPatient };
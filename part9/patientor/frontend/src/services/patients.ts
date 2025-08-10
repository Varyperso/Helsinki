import axios from "axios";
import { PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";
import { Entry, NewEntry, PatientEntry } from "@shared/types/patientTypes";

const getAll = async () => {
  const { data } = await axios.get<PatientEntry[]>(`${apiBaseUrl}/patients`);
  return data;
};

const getPatient = async (patientId: string) => {
  const { data } = await axios.get<PatientEntry>(`${apiBaseUrl}/patients/${patientId}`);
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<PatientEntry>(`${apiBaseUrl}/patients`, object);
  return data;
};

const addEntry = async (object: Record<string, any>, patientId: string) => {
  const { data } = await axios.post<NewEntry>(`${apiBaseUrl}/patients/${patientId}/entries`, object); 
  return data as Entry;
};

export default { getAll, getPatient, create, addEntry };
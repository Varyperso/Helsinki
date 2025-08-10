import axios from "axios";
import { DiagnosesEntry } from "@shared/types/patientTypes";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Array<DiagnosesEntry>>(`${apiBaseUrl}/diagnoses`);
  return data;
};

export default { getAll }
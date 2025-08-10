import diagnosesEntries from "../../data/diagnosesEntries";

const getDiagnosesEntries = () => diagnosesEntries;
const getAllPossibleCodes = () => getDiagnosesEntries().map(d => d.code)

export default { getDiagnosesEntries, getAllPossibleCodes };
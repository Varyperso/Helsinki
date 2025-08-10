import { Box, List, ListItem, Typography, Card, CardContent } from '@mui/material';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";

import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients'
import diagnosesService from '../../services/diagnoses'
import type { DiagnosesEntry, Entry, PatientEntry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry, NewEntry } from '../../../../shared/patientTypes'
import { assertNever } from '../../../../shared/utils'
import AddEntryForm from './AddEntryForm';

const PatientPage = () => {
  const [patient, setPatient] = useState<PatientEntry | null>(null)
  const [diagnosesList, setDiagnosesList] = useState<DiagnosesEntry[]>([])

  const params = useParams();
  const patientId = params.patientId;
  
  useEffect(() => {
    const fetchPatient = () => {
      if (patientId) patientService.getPatient(patientId).then(p => setPatient(p)).catch((e) => console.log("patient fetch error", e));
    }
    fetchPatient()
  }, [patientId])

  useEffect(() => {
    diagnosesService.getAll().then(setDiagnosesList);
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    if (!patientId || !patient) return
    const raw = Object.fromEntries(formData.entries());

    console.log(raw);
    

    const newEntry = {
      ...raw,
      discharge: {
        date: raw["dischargeDate"],
        criteria: raw["dischargeCriteria"]
      }
    };

      console.log(newEntry);
      
    patientService.addEntry(newEntry, patientId).then(p => {
      patient.entries.push(p);
      setPatient({...patient});
    })
  };

  if (!patient) return <div>Loading...</div>;
  
  return (
    <>
      <Box sx={{ width: 800, my: 2, p: 1, borderRadius: 2, boxShadow: 3, bgcolor: '#e9e1f8ff' }}>
        <Typography sx={{ fontSize: 22, py: 1 }}>{patient.name} {patient.gender === "male" ? <MaleIcon/> : patient.gender === "female" ? <FemaleIcon/> : <TransgenderIcon/>} </Typography>
        <Typography>Occupation: {patient.occupation}</Typography>
        <Typography>SSN: {patient.ssn}</Typography>
      </Box>

      <Box sx={{ width: 800, my: 3, p: 1, borderRadius: 1, boxShadow: 1, bgcolor: '#e4d3ebff' }}>
        <Typography sx={{ fontSize: 22, py: 1 }}>Entries: </Typography>
        <List sx={{ fontFamily: "Helvetica" }}>
          {patient?.entries?.map(e => <EntryDetails entry={e} diagnosesList={diagnosesList}></EntryDetails>)}
        </List>
      </Box>

      <AddEntryForm onSubmit={handleFormSubmit} />
    </>
  )
}
export default PatientPage;

const EntryDetails: React.FC<{ entry: Entry, diagnosesList: DiagnosesEntry[] }> = ({ entry, diagnosesList }) => {
  switch (entry.type) {
    case "HealthCheck": return <HealthCheckEntryComponent entry={entry} diagnosesList={diagnosesList}/>
    case "Hospital": return <HospitalEntryComponent entry={entry} diagnosesList={diagnosesList}/>
    case "OccupationalHealthcare": return <OccupationalHealthcareEntryComponent entry={entry} diagnosesList={diagnosesList}/>
    default: assertNever(entry)
  }
}

const HealthCheckEntryComponent = (props: { entry: HealthCheckEntry, diagnosesList: DiagnosesEntry[] }) => {
  const heartColors = ["green", "yellow", "orange", "red"];
  const entry = props.entry

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {entry.date} — {entry.type}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {entry.description}
        </Typography>
        <Typography variant="body2">Specialist: {entry.specialist}</Typography>

        <FavoriteIcon sx={{ color: heartColors[entry.healthCheckRating] }} />

        {entry.diagnosisCodes && (
          <List dense>
            {props.diagnosesList.filter(d => entry.diagnosisCodes?.includes(d.code)).map(d => <ListItem key={d.code}>{d.code} - {d.name}</ListItem>)}
          </List>
        )}
      </CardContent>
    </Card>
  );
};


const HospitalEntryComponent = (props: { entry: HospitalEntry, diagnosesList: DiagnosesEntry[] }) => {
  const entry = props.entry

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {entry.date} — {entry.type} <LocalHospitalIcon fontSize="small" />
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {entry.description}
        </Typography>
        <Typography variant="body2">Specialist: {entry.specialist}</Typography>

        <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
          Discharge:
        </Typography>
        <Typography variant="body2">
          {entry.discharge.date} — {entry.discharge.criteria}
        </Typography>

        {entry.diagnosisCodes && (
          <List dense>
            {props.diagnosesList.filter(d => entry.diagnosisCodes?.includes(d.code)).map(d => <ListItem key={d.code}>{d.code} - {d.name}</ListItem>)}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

const OccupationalHealthcareEntryComponent = (props: { entry: OccupationalHealthcareEntry, diagnosesList: DiagnosesEntry[] }) => {
  const entry = props.entry
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {entry.date} — {entry.type} <WorkIcon fontSize="small" /> (
          {entry.employerName})
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {entry.description}
        </Typography>
        <Typography variant="body2">Specialist: {entry.specialist}</Typography>

        {entry.sickLeave && (
          <>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              Sick Leave:
            </Typography>
            <Typography variant="body2">
              {entry.sickLeave.startDate} → {entry.sickLeave.endDate}
            </Typography>
          </>
        )}

        {entry.diagnosisCodes && (
          <List dense>
            {props.diagnosesList.filter(d => entry.diagnosisCodes?.includes(d.code)).map(d => <ListItem key={d.code}>{d.code} - {d.name}</ListItem>)}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
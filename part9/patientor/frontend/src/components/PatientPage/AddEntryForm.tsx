import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import diagnosesService from '../../services/diagnoses'
import { DiagnosesEntry } from "@shared/types/patientTypes";

export default function AddEntryForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [entryType, setEntryType] = useState<"Hospital" | "OccupationalHealthcare" | "HealthCheck">("Hospital");
  const [diagnosesCodes, setDiagnosesCodes] = useState<Array<DiagnosesEntry>>([])
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])
  
  useEffect(() => {
    diagnosesService.getAll().then(codes => setDiagnosesCodes(codes))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      onSubmit(formData);
    }
  };

  return (
    <Box
      component="form"
      ref={formRef}
      onSubmit={handleSubmit}
      sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, maxWidth: 500, backgroundColor: "#e4edffff", borderRadius: 2, boxShadow: 3 }}
    >
      <Typography variant="h6">Add New Entry</Typography>

      <TextField label="Description" name="description" required fullWidth />
      <TextField label="Date" name="date" type="date" InputLabelProps={{ shrink: true }} required />
      <TextField label="Specialist" name="specialist" required />
      
      <FormControl fullWidth variant="outlined">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          multiple
          value={selectedCodes}
          onChange={(e) => setSelectedCodes(e.target.value as string[])}
          renderValue={(selected) =>
            (selected as string[])
              .map(code => {
                const diag = diagnosesCodes.find(d => d.code === code);
                return diag ? `${diag.code} - ${diag.name}` : code;
              })
              .join(", ")
          }
        >
          {diagnosesCodes.map((entry) => (
            <MenuItem key={entry.code} value={entry.code}>
              <Checkbox checked={selectedCodes.includes(entry.code)} />
              <ListItemText primary={`${entry.code} - ${entry.name}`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth required variant="outlined">
        <InputLabel id="entry-type-label">Entry Type</InputLabel>
        <Select labelId="entry-type-label" value={entryType} onChange={(e) => setEntryType(e.target.value as any)} name="type" label="Entry Type" >
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          <MenuItem value="HealthCheck">Health Check</MenuItem>
        </Select>
      </FormControl>

      {entryType === "Hospital" && (
        <>
          <TextField label="Discharge Date" name="dischargeDate"type="date" slotProps={{ inputLabel: { shrink: true } }} required />
          <TextField label="Discharge Criteria" name="dischargeCriteria" required />
        </>
      )}

      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField label="Employer Name" name="employerName" required />
          <TextField label="Sick Leave Start Date" name="sickLeaveStart" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Sick Leave End Date" name="sickLeaveEnd" type="date" slotProps={{ inputLabel: { shrink: true } }} />
        </>
      )}

      {entryType === "HealthCheck" && (
        <TextField label="Health Check Rating (0-3)" name="healthCheckRating" type="number" slotProps={{ htmlInput: { min: 0, max: 3 } }} required />
      )}

      <Button variant="contained" color="primary" type="submit"> Save Entry </Button>
    </Box>
  );
}

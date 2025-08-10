import express, { Request, Response } from 'express';
import { Entry, NewPatientEntry, NonSensitivePatientEntry, PatientEntry } from '../../../shared/patientTypes';
import patientsService from '../services/patientsService';
import { newDiaryParser } from '../middleware/validateNewPatient';
import z from 'zod';
import { newEntryParser } from '../middleware/validateNewEntry';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientsService.getNonSensitivePatientEntries());
});

router.get('/:id', (req: Request<{ id: string }>, res: Response<PatientEntry>) => {
  const id = req.params.id;
  const patient = patientsService.findById(String(id));
  if (patient) res.send(patient);
  else res.status(404)
});

router.post('/', newDiaryParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<NonSensitivePatientEntry | { error: string | z.core.$ZodIssue[] }>) => {
  const addedPatient = patientsService.addPatient(req.body);
  res.json(addedPatient);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }>, res: Response<Entry | { error: string | z.core.$ZodIssue[] }>) => {
  const patientId = req.params.id
  const addedEntry = patientsService.addEntry(req.body, patientId)
  if (addedEntry) res.json(addedEntry)
  else res.status(404)
})
export default router;
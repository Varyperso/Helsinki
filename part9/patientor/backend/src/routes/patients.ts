import express, { Request, Response } from 'express';
import { NewPatientEntry, NonSensitivePatientEntry } from '../patientTypes';
import patientsService from '../services/patientsService';
import { newDiaryParser } from '../middleware/validateNewPatient';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientsService.getNonSensitivePatientEntries());
});

router.get('/:id', (req, res: Response<NonSensitivePatientEntry>) => {
  const id = req.params.id;
  const patient = patientsService.findById(String(id));
  if (patient) res.send(patient);
});

router.post('/', newDiaryParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<NonSensitivePatientEntry | { error: string | z.core.$ZodIssue[] }>) => {
  try { 
    const addedPatient = patientsService.addPatient(req.body);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) res.status(400).send({ error: error.issues });
    else res.status(400).send({ error: 'unknown error' });
  }
});

export default router;
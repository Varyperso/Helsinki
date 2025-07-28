import express, { Response } from 'express';
import { DiagnosesEntry } from '../patientTypes';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosesEntry[]>) => {
  res.send(diagnosesService.getDiagnosesEntries());
});

router.post('/', (_req, res) => {
  res.send("post diagnoses");
});

export default router;
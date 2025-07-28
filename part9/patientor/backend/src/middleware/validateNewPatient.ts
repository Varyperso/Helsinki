import { Request, Response, NextFunction } from 'express';
import { newPatientSchema } from '../patientUtils';

export const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    req.body = newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { newEntrySchema } from '../patientUtils';
import diagnosesService from '../services/diagnosesService'

export const newEntryParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    const parsedEntry = newEntrySchema.parse(req.body);

    if (parsedEntry.diagnosisCodes) {
      const allCodes = diagnosesService.getAllPossibleCodes();
      const invalidCodes = parsedEntry.diagnosisCodes.filter(code => !allCodes.includes(code));
      if (invalidCodes.length > 0) next(new Error(`Invalid diagnosis codes: ${invalidCodes.join(', ')}`));
    }
    
    req.body = parsedEntry;
    next();
  } catch (error: unknown) {
    next(error);
  }
};
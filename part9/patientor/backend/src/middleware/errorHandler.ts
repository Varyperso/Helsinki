import { NextFunction, Request, Response } from 'express';
import z from 'zod';

function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    console.error("Caught ZodError in error handler", err);
    res.status(400).send({ error: err.issues });
  } 
  else if (err instanceof Error) {
    console.error("Caught Error in error handler", err);
    res.status(400).send({ error: err.message })
  } 
  else {
    console.error("Unknown error:", err);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export default errorHandler
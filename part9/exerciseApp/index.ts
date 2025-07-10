import calculateBmi from './bmiCalculator';
import exerciseCalculator from './exerciseCalculator';
import { isValidNumber } from './helpers';

import express, { Request, Response } from 'express';
const app = express();
app.use(express.json());

type ReqBMIQuery = {
  height?: string
  weight?: string
};

type ReqExerciseBody = {
  daily_exercises: number[]
  target: number
};

app.get('/bmi', (req: Request<unknown, unknown, unknown, ReqBMIQuery>, res: Response) => {
  const { height, weight } = req.query;
  if (!height || !weight) throw new Error('missing query argument/s');
  try {
    const parsedHeight = Number(height);
    const parsedWeight = Number(weight);
    if (!isValidNumber(parsedHeight) || !isValidNumber(parsedWeight)) throw new Error('query arguments must be of number type');
    const resultStringBMI = calculateBmi(parsedHeight, parsedWeight);
    res.send(resultStringBMI);
  }
  catch(error: unknown) {
    let erroString;
    if (error instanceof Error) erroString = error.message;
    res.send({ error: erroString });
  }
});

app.post('/exercise', (req: Request<unknown, unknown, ReqExerciseBody, unknown>, res: Response) => {
  const { daily_exercises, target } = req.body;
  if (!daily_exercises || !target) throw new Error('arguments missing');
  try {
    if (!Array.isArray(daily_exercises) || !daily_exercises.every((n: unknown) => isValidNumber(n) && n >= 0)) throw new Error('argument must be an array of positive numbers');

    const hoursPerDay = Number(target);
    if (Number.isNaN(hoursPerDay)) throw new Error('target must be a number');
    if (hoursPerDay < 0) throw new Error('target must be a positive number');
    if (hoursPerDay > 12) throw new Error('target must be a reasonable number..');
    const exerciseResult = exerciseCalculator(daily_exercises, target);
    res.send(exerciseResult);
  }
  catch(error: unknown) {
    let erroString;
    if (error instanceof Error) erroString = error.message;
    res.send({ error: erroString });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
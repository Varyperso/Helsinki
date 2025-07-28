import { isValidNumber } from "./helpers";

type CalculatorArgs = {
  hoursArr: number[];
  hoursPerDay: number;
};

interface ICalculator {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

function isNumberArray(arr: unknown): arr is number[] {
  return Array.isArray(arr) && arr.every(n => typeof n === 'number' && !Number.isNaN(n));
}

function parseArguments(args: string[]): CalculatorArgs {
  try {
    const parsed: unknown = JSON.parse(args[2]);
    if (!isNumberArray(parsed)) throw new Error('argument must be an array of positive numbers');
    const hoursArr = parsed; // at this point TypeScript knows `parsed` is `number[]` because of "arr is number[]"

    const hoursPerDay = Number(args[3]);
    if (Number.isNaN(hoursPerDay)) throw new Error('second argument must be a number');
    if (hoursPerDay < 0) throw new Error('second argument must be a positive number');
    if (hoursPerDay > 12) throw new Error('second argument must be a reasonable number..');

    return { hoursArr, hoursPerDay };
  }
  catch(error: unknown) {
    let errorMessage;
    if (error instanceof Error) errorMessage = error.message;
    console.error(errorMessage);
    throw error;
  }
}

export default function exerciseCalculator(hoursArr: number[], hoursPerDay: number) : ICalculator {
  let periodLength: number = 0;
  let trainingDays: number = 0;
  let rating: number;
  let sum: number = 0;
  let success: boolean = false;
  let ratingDescription: string;

  hoursArr.forEach(h => {
    periodLength++;
    if (h > 0) trainingDays++;
    sum += h;
  });

  const average = sum / periodLength;
  if (average > hoursPerDay) success = true;

  switch(true) {
    case average < hoursPerDay / 3: {
      rating = 1;
      ratingDescription = 'very, very bad(as usual).';
      break;
    }
    case average < hoursPerDay / 2: {
      rating = 2;
      ratingDescription = 'pretty bad. u\'r improving.';
      break;
    }
    case average < hoursPerDay / 1.5: {
      rating = 3;
      ratingDescription = 'wow, almost there.';
      break;
    }
    case average >= hoursPerDay / 1.5 && average < hoursPerDay * 1.25: {
      rating = 4;
      ratingDescription = 'i am so proud.';
      break;
    }
    default: {
      rating = 5;
      ratingDescription = 'unbelievable, this must be a dream.';
    }
  }

  return { 
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target: hoursPerDay,
    average
  };
}

if (require.main === module) {
  try {
    const { hoursArr, hoursPerDay }: CalculatorArgs = parseArguments(process.argv);
    const result: ICalculator = exerciseCalculator(hoursArr, hoursPerDay);
    console.info(result);
  }
  catch(error: unknown) {
    let errorMessage;
    if (error instanceof Error) errorMessage = error.message;
    console.error(errorMessage);
  }
}
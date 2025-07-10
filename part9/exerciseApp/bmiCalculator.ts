import { isValidNumber } from "./helpers";

interface BMIValues {
  height: number;
  weight: number;
}

function parseArguments(args: string[]) : BMIValues {
  if (args.length !== 4) throw new Error('Please provide exactly 2 arguments: height(cm) and weight(kg)');

  const height = Number(args[2]);
  const weight = Number(args[3]);
  if (!isValidNumber(height) || !isValidNumber(weight)) throw new Error('invalid arguments type, should be numbers');
  if (height <= 0 || weight <= 0) throw new Error('invalid height/weight entered');
  
  return {
    height,
    weight
  };
}

export default function calculateBmi(height: number, weight: number) : string {
  const BMI: number = weight / (height / 100) ** 2;
  let resultString;
  
  switch(true) {
    case BMI < 16.0: resultString = 'Underweight (Severe thinness)'; break;
    case BMI < 17.0: resultString = 'Moderate (Severe thinness)'; break;
    case BMI < 18.5: resultString = 'Underweight (Mild thinness)'; break;
    case BMI < 25.0: resultString = 'Normal range'; break;
    case BMI < 30.0: resultString = 'Overweight (Pre-obese)'; break;
    case BMI < 35.0: resultString = 'Obese (Class I)'; break;
    case BMI < 40: resultString = 'Obese (Class II)'; break;
    default: resultString = 'Obese (Class III)'; break;
  }
  console.log(resultString);
  return resultString;
}

if (require.main === module) { // only runs if we are running via "node bmiCalculator.ts heightArg weightArg"
  try {
    const { height, weight }: BMIValues = parseArguments(process.argv);
    calculateBmi(height, weight);
  }
  catch(error: unknown) {
    let errorMessage;
    if (error instanceof Error) errorMessage = `Error: ${error.message}`;
    console.log(errorMessage);
  }
}
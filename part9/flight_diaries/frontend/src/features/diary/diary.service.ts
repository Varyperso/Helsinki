import { NonSensitiveDiariesSchema, NonSensitiveDiaryEntrySchema } from "./diary.schema";
import type { NonSensitiveDiaryEntry, NewDiaryEntry } from "./diary.types";
import { ZodError } from 'zod';

export const fetchDiaries = async (): Promise<NonSensitiveDiaryEntry[] | { error: string }> => {
  try {
    const response = await fetch('http://localhost:3001/api/diaries');
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    return NonSensitiveDiariesSchema.parse(await response.json());
  }
  catch(e: unknown) {
    if (e instanceof ZodError) return { error: e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; ') };
    if (e instanceof Error) return { error: e.message };
    return { error: 'unknown error occured'};
  }
}

export const addDiary = async (diary: NewDiaryEntry) : Promise<NonSensitiveDiaryEntry | { error: string }> => {
  try {
    const response = await fetch('http://localhost:3001/api/diaries', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diary),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    return NonSensitiveDiaryEntrySchema.parse(await response.json());
  }
  catch(e: unknown) {
    if (e instanceof ZodError) return { error: e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; ') };
    if (e instanceof Error) return { error: e.message };
    return { error: 'unknown error occured'};
  }
}
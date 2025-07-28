import { useEffect, useState } from "react";
import type { NonSensitiveDiaryEntry } from "./features/diary/diary.types";
import { addDiary, fetchDiaries } from "./features/diary/diary.service";
import { NewDiaryEntrySchema, WeatherEnum, VisibilityEnum } from "./features/diary/diary.schema";
import { ZodError } from "zod";

function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([] as NonSensitiveDiaryEntry[]);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDiaries = async () => {
      const result = await fetchDiaries();
      if ('error' in result) setError(result.error);
      else setDiaries(result);
    }
    getDiaries();
  }, [])

  return (
    <>
      <h2>Add New Entry:</h2>
      <Form setError={setError} setDiaries={setDiaries} />
      <p>{error}</p>
      <Diaries diaries={diaries} />
    </>
  )
}

export default App;


type FormProps = { setError: React.Dispatch<React.SetStateAction<string>>, setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>> }

const Form = ({ setDiaries, setError }: FormProps) => {
  const onAddDiary = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const rawTrimmed = Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));

    let parsed;
    try {
      parsed = NewDiaryEntrySchema.parse(rawTrimmed);
    } catch (e) {
      if (e instanceof ZodError) setError(e.issues.map(err => `${err.path.join('.')}: ${err.message}`).join('; '));
      return;
    }

    const result = await addDiary(parsed);
    if ('error' in result) setError(result.error);
    else setDiaries(diaries => [...diaries, result]);
  };

  return (
    <>
      <form onSubmit={onAddDiary} style={{ display: "flex", flexDirection: "column" }}>
        <div>Date: <input name="date" type="date" /></div>

        <div>Weather
          <select name="weather" required>
            {WeatherEnum.options.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        
        <div>Visibility
          <select name="visibility" required>
           {VisibilityEnum.options.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div>Comment: <input name="comment" type="text" /></div>

        <button type="submit">Add Diary</button>
      </form>
    </>
  )
}


const Diaries = ({ diaries }: { diaries: NonSensitiveDiaryEntry[] } ) => {
  return (
    <>
      {diaries.map(d => <p key={d.id}>{d.date} {d.visibility} {d.weather}</p>)}
    </>
  )
}
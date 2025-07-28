import { z } from "zod";
import { DiaryEntrySchema, NewDiaryEntrySchema, NonSensitiveDiaryEntrySchema, WeatherEnum, VisibilityEnum } from "./diary.schema";

export type Weather = z.infer<typeof WeatherEnum>;
export type Visibility = z.infer<typeof VisibilityEnum>;

export type DiaryEntry = z.infer<typeof DiaryEntrySchema>;
export type NonSensitiveDiaryEntry = z.infer<typeof NonSensitiveDiaryEntrySchema>;
export type NewDiaryEntry = z.infer<typeof NewDiaryEntrySchema>;
import { z } from "zod";

export const WeatherEnum = z.enum(['sunny', 'rainy', 'cloudy', 'stormy', 'windy']);
export const VisibilityEnum = z.enum(['great', 'good', 'ok', 'poor']);

export const DiaryEntrySchema = z.object({
  id: z.number(),
  date: z.string(),
  weather: WeatherEnum,
  visibility: VisibilityEnum,
  comment: z.string(),
});

export const NonSensitiveDiaryEntrySchema = DiaryEntrySchema.omit({ comment: true });
export const NonSensitiveDiariesSchema = z.array(NonSensitiveDiaryEntrySchema);

export const NewDiaryEntrySchema = DiaryEntrySchema.omit({ id: true });
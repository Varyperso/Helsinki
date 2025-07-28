import express from 'express';
import cors from 'cors';

const app = express();

import diaryRouter from './routes/diaries';

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173'}));

const PORT = 3001;

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
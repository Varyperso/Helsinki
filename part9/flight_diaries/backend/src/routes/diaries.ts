import express from 'express';

const router = express.Router();

router.get('/patients', (_req, res) => {
  res.send("get diaries")
})

router.post('/patients', (_req, res) => {
  res.send("post diary")
})

export default router;
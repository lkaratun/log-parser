import express from 'express';
import { lastNLines } from './manual.js';
const app = express();

app.get('/search', async function (req, res) {
  const { fileName, numLines } = req.query;

  const searchResult = await lastNLines(fileName, numLines);
  res.send(searchResult);
});

const port = 12345;
app.listen(port, () => console.log(`Server listening on port ${port}`));

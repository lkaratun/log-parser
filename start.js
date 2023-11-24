import express from 'express';
import { lastNLines } from './search.js';
const app = express();

app.get('/search', async function (req, res) {
  const { fileName, numLines, searchTerm } = req.query;
  try {
    const searchResult = await lastNLines(fileName, numLines, searchTerm);
    res.send(searchResult);
  } catch (e) {
    console.error(e);
    if (e.code === 'ENOENT') return res.status(404).send('File does no exist');
    return res.status(500).send(e.message);
  }
});

const port = 12345;
app.listen(port, () => console.log(`Server listening on port ${port}`));

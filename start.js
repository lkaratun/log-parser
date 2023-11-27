import express from 'express';
import { lastNLines } from './search.js';
const app = express();
import path from 'path';

// Return numLines lines from file fileName containing searchTerm, newer lines first.
// If searchTerm is not provided, return all lines up to the requested limit (numLines)
// File must be located under /var/log
app.get('/search', async function (req, res) {
  const { fileName, numLines, searchTerm } = req.query;
  const LOG_LOCATION = '/var/log';
  const filePath = path.resolve(LOG_LOCATION, fileName);
  try {
    const searchResult = await lastNLines(filePath, numLines, searchTerm);
    res.send(searchResult);
  } catch (e) {
    console.error(e);
    if (e.code === 'ENOENT') return res.status(404).send('File does no exist');
    // Assuming all consumers are internal and it's safe to expose internal error details
    return res.status(500).send(e.message);
  }
});

const port = 12345;
app.listen(port, () => console.log(`Server listening on port ${port}`));

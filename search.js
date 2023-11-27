import fs from 'node:fs/promises';
import { read, open, close } from 'fs';
import util from 'util';
import path from 'path';

const DEFAULT_CHUNK_SIZE = 16 * 1024; //16kB
const LOG_LOCATION = '/var/log';

export async function lastNLines(fileName, n, searchTerm) {
  const file = await util.promisify(open)(path.resolve(LOG_LOCATION, fileName), 'r');
  let { size: fileSize } = await fs.stat(path.resolve(LOG_LOCATION, fileName));
  const chunkSize = Math.min(DEFAULT_CHUNK_SIZE, fileSize);

  const result = [];
  let currentPosition = fileSize;
  while (result.length < n && currentPosition > 0) {
    const chunk = await getChunk(file, currentPosition, chunkSize);
    const chunkStr = chunk.toString();
    // First line will be a partial one. Don't consider it
    const lines = chunkStr.split('\n').slice(1);
    const matchingLines = searchTerm ? lines.filter(line => line.includes(searchTerm)) : lines;
    result.push(...matchingLines.reverse());

    const partialLineSize = getPartialLineSize(chunk);
    currentPosition -= chunkSize - partialLineSize;
  }
  close(file);
  return result.slice(result.length - n);
}

async function getChunk(file, end, chunkSize) {
  // If chunk is bigger than size of data to be read, only read existing data
  const chunkSizeAdjusted = Math.min(chunkSize, end);
  const fileReadResult = await util.promisify(read)(
    file,
    Buffer.alloc(chunkSizeAdjusted),
    0,
    chunkSizeAdjusted,
    end - chunkSizeAdjusted
  );
  return fileReadResult.buffer;
}

function getPartialLineSize(chunk, lineDelimiter = '\n') {
  const firstLineEndPositon = chunk.indexOf(lineDelimiter);
  const partialFirstLine = chunk.slice(0, firstLineEndPositon);
  return Buffer.byteLength(partialFirstLine);
}

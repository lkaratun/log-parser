import fs from 'node:fs/promises';
import { read, open, close } from 'fs';
import util from 'util';

const DEFAULT_CHUNK_SIZE = 16 * 1024; //16kB

export async function lastNLines(filePath, n = 20, searchTerm) {
  const file = await util.promisify(open)(filePath, 'r');
  let { size: fileSize } = await fs.stat(filePath);
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

export async function getChunk(file, end, chunkSize) {
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

export function getPartialLineSize(chunk, lineDelimiter = '\n') {
  const firstLineEndPositon = chunk.indexOf(lineDelimiter);
  const partialFirstLine = chunk.slice(0, firstLineEndPositon + 1);
  return Buffer.byteLength(partialFirstLine);
}

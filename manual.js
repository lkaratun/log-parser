import fs from 'node:fs/promises';
import { read, open } from 'fs';
import util from 'util';

async function getChunk(file, end, chunkSize) {
  const fileReadResult = await util.promisify(read)(file, Buffer.alloc(chunkSize), 0, chunkSize, end - chunkSize);
  return fileReadResult.buffer;
}

export async function lastNLines(fileName, n, searchTerm) {
  const file = await util.promisify(open)(fileName, 'r');
  const result = [];
  let { size: fileSize } = await fs.stat(fileName);
  const chunkSize = Math.min(25, fileSize);
  let currentPosition = fileSize;
  while (result.length < n) {
    const chunk = await getChunk(file, currentPosition, chunkSize);
    const chunkStr = chunk.toString();
    // First line will be a partial one. Don't consider it
    const lines = chunkStr.split('\n').slice(1);
    const matchingLines = searchTerm ? lines.filter(line => line.includes(searchTerm)) : lines;
    result.unshift(...matchingLines);

    const firstLineEndPositon = chunk.indexOf('\n');
    const partialFirstLine = chunk.slice(0, firstLineEndPositon);
    const partialFirstLineSize = Buffer.byteLength(partialFirstLine);

    currentPosition -= chunkSize - partialFirstLineSize;
  }
  return result.slice(result.length - n);
}

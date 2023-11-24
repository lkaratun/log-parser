import fs from 'node:fs/promises';
import { read, open } from 'fs';
import util from 'util';

async function getChunk(file, end, chunkSize) {
  const fileReadResult = await util.promisify(read)(file, Buffer.alloc(chunkSize), 0, chunkSize, end - chunkSize);
  return fileReadResult.buffer;
}

async function lastNLines(n) {
  const filePath = './log';
  const file = await util.promisify(open)(filePath, 'r');
  const result = [];
  let { size: fileSize } = await fs.stat(filePath);
  const chunkSize = Math.min(25, fileSize); // 16 kB
  let currentPosition = fileSize;
  while (result.length < n) {
    const chunk = await getChunk(file, currentPosition, chunkSize);
    const chunkStr = chunk.toString();
    const lines = chunkStr.split('\n');
    // First line will be a partial one
    result.unshift(...lines.slice(1));

    const firstLineEndPositon = chunk.indexOf('\n');
    const partialFirstLine = chunk.slice(0, firstLineEndPositon);
    const partialFirstLineSize = Buffer.byteLength(partialFirstLine);

    currentPosition -= chunkSize - partialFirstLineSize;
  }
  return result.slice(result.length - n);
}

const lastNLinesResult = await lastNLines(10);
console.log('🚀 ~ file: manual.js:47 ~ test:', lastNLinesResult);

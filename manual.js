import fs from 'node:fs/promises';
import { read, open } from 'fs';
import util from 'util';

// const file = await fs.open('./log', 'r');
// console.log('🚀 ~ file: manual.js:4 ~ file:', file);
// const readStream = file.createReadStream();
// console.log('🚀 ~ file: manual.js:7 ~ readStream:', readStream);

// for await (const line of file.readLines()) {
//   console.log(line);
// }

// console.log('🚀 ~ file: manual.js:13 ~ stats:', stats);

// console.log('🚀 ~ file: manual.js:20 ~ file:', file);

// const numBytes = 100;
// const buffer = Buffer.alloc(numBytes);
// console.log('🚀 ~ file: manual.js:21 ~ fileReadResult:', fileReadResult);
// console.log('🚀 ~ file: manual.js:21 ~ fileReadResult: buffer', fileReadResult.buffer.toString());
// const searchResult = fileReadResult.buffer.toString();
// const resultingLines = searchResult.split('\n');
// console.log('🚀 ~ file: manual.js:29 ~ resultingLines:', resultingLines);

async function getChunk(file, end, chunkSize) {
  //   console.log('🚀 ~ file: manual.js:27 ~ getChunk ~ file, end, chunkSize:', file, end, chunkSize);
  const fileReadResult = await util.promisify(read)(file, Buffer.alloc(chunkSize), 0, chunkSize, end - chunkSize);
  return fileReadResult.buffer.toString();
}

async function lastNLines(n) {
  const filePath = './log';
  const file = await util.promisify(open)(filePath, 'r');
  const result = [];
  let { size: fileSize } = await fs.stat(filePath);
  const chunkSize = Math.min(16 * 1024, fileSize); // 16 kB
  let currentPosition = fileSize;
  let i = 0;
  //   while (result.length < n && i++ < 2) {
  //   console.log('🚀 ~ file: manual.js:38 ~ lastNLines ~ result:', result);
  const chunk = await getChunk(file, currentPosition, chunkSize);
  //   console.log('🚀 ~ file: manual.js:41 ~ lastNLines ~ chunk:', chunk);
  const lines = chunk.split('\n');
  //   console.log('🚀 ~ file: manual.js:41 ~ lastNLines ~ lines:', lines);
  // First line will be a partial one
  result.push(...lines.slice(1));
  //   }
  return result.slice(result.length - n);
}

const test = await lastNLines(3);
console.log('🚀 ~ file: manual.js:47 ~ test:', test);

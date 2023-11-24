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

const filePath = './log_large';

const stats = await fs.stat(filePath);
console.log('🚀 ~ file: manual.js:13 ~ stats:', stats);

const file = await util.promisify(open)(filePath, 'r');
console.log('🚀 ~ file: manual.js:20 ~ file:', file);

const buffer = Buffer.alloc(128);
const fileReadResult = await util.promisify(read)(file, buffer, 0, 128, stats.size - 128);
console.log('🚀 ~ file: manual.js:21 ~ fileReadResult:', fileReadResult);
console.log('🚀 ~ file: manual.js:21 ~ fileReadResult: buffer', fileReadResult.buffer.toString());

// const result = Buffer.alloc(createReadStream);

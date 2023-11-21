import fs from 'node:fs/promises';
import Stream from 'stream';

const largeLog = await fs.open('./log_large', 'w');

let i = 0;
const readStream = new Stream.Readable({
  read(size) {
    if (i < 1e8) this.push(`Line ${i++}\n`);
    else return null;
  }
});

const writeStream = largeLog.createWriteStream();

readStream.on('error', err => {
  console.trace(err);
});

readStream.pipe(writeStream);

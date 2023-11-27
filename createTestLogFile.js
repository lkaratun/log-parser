import fs from 'node:fs/promises';
import Stream from 'stream';

async function run(lineCountPower = 3) {
  const largeLog = await fs.open(`/var/log/cribl_test_log_${lineCountPower}`, 'w');

  let i = 0;
  const readStream = new Stream.Readable({
    read(size) {
      if (i < Math.pow(10, lineCountPower)) this.push(`Line ${i++}\n`);
      else return null;
    }
  });

  const writeStream = largeLog.createWriteStream();

  readStream.on('error', err => {
    console.trace(err);
  });

  readStream.pipe(writeStream);
}

await run(process.argv[2]);

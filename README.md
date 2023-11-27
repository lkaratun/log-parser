# Log parser

## Usage

1. `npm i && npm start`
2. Send a GET request to `localhost:12345/search?fileName=<filename>&numLines=<number>&searchTerm=<string>`

## Testing steps

1. **To generate a large log file** under `/var/log/` called `cribl_test_log_<num>`:

   `sudo node createTestLogFile.js <num>` where `num` is log10 of the number of lines to write to the test file.

   For example, to create a file with 1e8 lines, run `sudo node createTestLogFile.js 8`. `sudo` is needed to write the file to /var/log

2. **To search the generated file:**

   `GET localhost:12345/search?fileName=cribl_test_log_8&numLines=20&searchTerm=12345`

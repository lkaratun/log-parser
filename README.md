# Log parser

## TL;DR
```
npm i && sudo node createTestLogFile.js 6 && npm start
GET localhost:12345/search?fileName=cribl_test_log_6&numLines=20&searchTerm=12345
```


## Setup

To generate a large log file under `/var/log` called `cribl_test_log_<num>`:

   `sudo node createTestLogFile.js <num>` where `num` is log10 of the number of lines to write to the test file.

   For example, to create a file with 1e6 lines, run `sudo node createTestLogFile.js 6`. `sudo` is needed to write the file to /var/log

2. **To search the generated file:**




## Usage

1. `npm i && npm start`
2. Send a GET request to `localhost:12345/search?fileName=<filename>&numLines=<number>&searchTerm=<string>`, where:

   - `filename` is the name of the log file located under `/var/log`
   - `searchTerm` is the term to filter the lines by. Defaults to no filtering
   - `numLines` is the number of matches you'd like to receive. Defaults to 20

To search the file generated in the setup step: 
`GET localhost:12345/search?fileName=cribl_test_log_6&numLines=20&searchTerm=12345`

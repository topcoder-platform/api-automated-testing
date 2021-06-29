# Topcoder API Testing Lib

## Tech Stack

- [Node.js](https://nodejs.org/) v10

## Local Setup

### Requirements

- [Node.js](https://nodejs.org/en/) v10+

### Configuration

In order to use the library, the following config values should exist from the caller API.
- WAIT_TIME: wait time
- AUTH_V2_URL: The auth v2 url
- AUTH_V2_CLIENT_ID: The auth v2 client id
- AUTH_V3_URL: The auth v3 url
- ADMIN_CREDENTIALS_USERNAME: The user's username with admin role
- ADMIN_CREDENTIALS_PASSWORD: The user's password with admin role
- COPILOT_CREDENTIALS_USERNAME: The user's username with copilot role
- COPILOT_CREDENTIALS_PASSWORD: The user's password with copilot role
- USER_CREDENTIALS_USERNAME: The user's username with user role
- USER_CREDENTIALS_PASSWORD: The user's password with user role
- AUTOMATED_TESTING_REPORTERS_FORMAT: The reporters format. It is an array of the formats. e.g. `['html']` produces normal html format. `['cli', 'json', 'junit', 'html']` is the full format.   
*For the details of the supported format, please refer to https://www.npmjs.com/package/newman#reporters*

### Steps to use
1. From the testing API, install this lib by add the dependency to the `package.json`

   ```json
   "tc-api-testing-lib": "file:../tc-api-testing-lib"
   ```

2. Calling the testing lib to test against inner defined testin  
   ```js
   // import library
   const apiTestLib = require('tc-api-testing-lib')
   // run the test
   apiTestLib.runTests(requests, collectionFileFullPath, environmentFileFullPath).then(async () => {
     // continue on success
   }).catch(async (err) => {
     // continue on failure
   })
   ```
   - `requests` the array of the testing requests. Each array element is like:
     ```
      {
         folder: 'create resource role by admin',
         iterationData: require('./testData/resource-role/create-resource-role-by-admin.json')
      }
     ```
   - `collectionFileFullPath` is the full file path of the postman collection file.
   - `environmentFileFullPath` is the full file path of the postman environment file.

3. The CircleCI can get the aggregated text summary like:
```text
────────────────────────────────────────────────────────────────────
Total tests: 115	Success: 111	Failures: 4 
info: newman test completed!
info: Clear the Postman test data.
Report saved
info: Finished clear the Postman test data.
```

### Testing results logs
The testing reporter files will be generated in the caller's `newman` folder. As the script to run tests are usually `npm run test:newman`, just use the `newman` as the testing results folder.   
`templates/report.html` is the template for the aggregated reports. As the newman does not provide the aggregated reports, test results will use this template to generate one.   
*The aggregated reports will be generated in the caller's `newman` folder too, named `reports.html`.*


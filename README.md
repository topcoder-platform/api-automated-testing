# Topcoder API Testing Lib

## Tech Stack

- [Node.js](https://nodejs.org/) v10+

## Local Setup

### Requirements

- [Node.js](https://nodejs.org/en/) v10+
- [Postman](https://www.postman.com/downloads/)
- npm
- Newman CLI

### Common configuration parameters

In order to use the library, the following configuration values should exist from the caller API.
- AUTH0_URL: The Auth0 URL used to get the M2M token
- AUTH0_AUDIENCE: The Auth0 audience used to get the M2M token
- TOKEN_CACHE_TIME: The M2M token cache time
- AUTH0_PROXY_SERVER_URL: The Auth0 proxy server URL to use to get the M2M token
- AUTH0_CLIENT_ID: The Auth0 client id
- AUTH0_CLIENT_SECRET: The Auth0 client secret
- AUTH_V2_URL: The auth v2 url to use to get the user token from V2 API
- AUTH_V2_CLIENT_ID: The auth v2 client id
- AUTH_V3_URL: The auth v3 url
- ADMIN_CREDENTIALS_USERNAME: The user's username with admin role
- ADMIN_CREDENTIALS_PASSWORD: The user's password with admin role
- MANAGER_CREDENTIALS_USERNAME: The username of the user with manager role
- MANAGER_CREDENTIALS_PASSWORD: The password of the user with manager role
- COPILOT_CREDENTIALS_USERNAME: The user's username with copilot role
- COPILOT_CREDENTIALS_PASSWORD: The user's password with copilot role
- USER_CREDENTIALS_USERNAME: The user's username with user role
- USER_CREDENTIALS_PASSWORD: The user's password with user role
- WAIT_TIME: The wait time in milliseconds for each test
- AUTOMATED_TESTING_REPORTERS_FORMAT: The reporters format. It is an array of the formats. e.g. `['html']` produces normal html format. `['cli', 'json', 'junit', 'html']` is the full format.   
*For the details of the supported format, please refer to https://www.npmjs.com/package/newman#reporters*

### Additional configuration parameters for Ubahn-api:

In order to use this library in [Ubahn-api](https://github.com/topcoder-platform/u-bahn-api), in addition to the `common configuration` parameters listed above, the following parameters should also be configured:

- USER_ID_BY_ADMIN: The id of the user created by the admin
- USER_ID_BY_TESTER: The id of the user created by the normal user
- PROVIDER_ID_BY_ADMIN: The id of the provider created by the admin
- PROVIDER_ID_BY_TESTER: The id of the provider created by the normal user
- SKILL_ID_BY_ADMIN: The id of the skill created by the admin
- SKILL_ID_BY_TESTER: The id of the skill created by the normal user
- ROLE_ID_BY_ADMIN: The id of the role created by the admin
- ROLE_ID_BY_TESTER: The id of the role created by the normal user
- ORGANIZATION_ID_BY_ADMIN: The id of the organization created by the admin
- ORGANIZATION_ID_BY_TESTER: The id of the organization created by the normal user
- ACHIEVEMENTS_PROVIDER_ID_BY_ADMIN: The id of the achievements' provider created by the admin
- ACHIEVEMENTS_PROVIDER_ID_BY_TESTER: The id of the achievements' provider created by the normal user
- ATTRIBUTE_GROUP_ID_BY_ADMIN: The id of the attribute group created by the admin
- ATTRIBUTE_GROUP_ID_BY_TESTER: The id of the attribute group created by the normal user
- ATTRIBUTE_ID_BY_ADMIN: The id of the attribute created by the admin
- ATTRIBUTE_ID_BY_TESTER: The id of the attribute created by the normal user
- ACHIEVEMENT_ID_BY_ADMIN: The id of the achievement created by the admin
- ACHIEVEMENT_ID_BY_TESTER: The id of the achievement created by the normal user

### Additional configuration parameters for tc-project-service:

In order to use this library in [tc-project-service](https://github.com/topcoder-platform/tc-project-service), in addition to the `common configuration` parameters listed above, the following parameters should also be configured:

- ADMIN_ID: The ID of the admin user identified by ADMIN_CREDENTIALS_USERNAME/ADMIN_CREDENTIALS_PASSWORD above
- USER_ID: The ID of the normal user identified by USER_CREDENTIALS_USERNAME/USER_CREDENTIALS_PASSWORD above
- COPILOT_ID: The ID of the copilot user identified by COPILOT_CREDENTIALS_USERNAME/COPILOT_CREDENTIALS_PASSWORD above
- POSTMAN_UPLOADED_FILES_PATH: The upload file path for uploading file to S3
- POSTMAN_S3_BUCKET: The S3 bucket used for testing

### Steps to use
1. In the API to be tested, install this library by adding the dependency to the `devDependencies` section in `package.json`

   ```
   "devDependencies": {
    "tc-api-testing-lib": "topcoder-platform/api-automated-testing.git"
   }
   ```

This also can be done by running the following command in the root folder of the caller API: `npm install --save-dev github:topcoder-platform/api-automated-testing`

2. Configuring the library in the caller API:

In order to configure this library, the caller API must set the above-mentioned configuration parameters either via environment variables or configuration files.

When using the configuration files with [config](https://www.npmjs.com/package/config) npm package, to configure the library, the caller API must:
- Set the needed configuration parameters in `${Caller-API}/config/test.js` (See required configuration parameters list above)
- Properly set the NODE_ENV=test when running the newman tests, for example: `NODE_ENV=test node test/postman/newman.js`, where newman.js contains the e2e tests using newman

Sample `config/test.js` looks like:
```js
module.exports = {
  WAIT_TIME: process.env.WAIT_TIME || 5000,
  AUTH_V2_URL: process.env.AUTH_V2_URL || 'https://topcoder-dev.auth0.com/oauth/ro',
  AUTH_V2_CLIENT_ID: process.env.AUTH_V2_CLIENT_ID || '',
  AUTH_V3_URL: process.env.AUTH_V3_URL || 'https://api.topcoder-dev.com/v3/authorizations',
  ADMIN_CREDENTIALS_USERNAME: process.env.ADMIN_CREDENTIALS_USERNAME || '',
  ADMIN_CREDENTIALS_PASSWORD: process.env.ADMIN_CREDENTIALS_PASSWORD || '',
  USER_CREDENTIALS_USERNAME: process.env.USER_CREDENTIALS_USERNAME || '',
  USER_CREDENTIALS_PASSWORD: process.env.USER_CREDENTIALS_PASSWORD || '',
  MANAGER_CREDENTIALS_USERNAME: process.env.MANAGER_CREDENTIALS_USERNAME || '',
  MANAGER_CREDENTIALS_PASSWORD: process.env.MANAGER_CREDENTIALS_PASSWORD || '',
  COPILOT_CREDENTIALS_USERNAME: process.env.COPILOT_CREDENTIALS_USERNAME || '',
  COPILOT_CREDENTIALS_PASSWORD: process.env.COPILOT_CREDENTIALS_PASSWORD || '',
  AUTOMATED_TESTING_REPORTERS_FORMAT: process.env.AUTOMATED_TESTING_REPORTERS_FORMAT
    ? process.env.AUTOMATED_TESTING_REPORTERS_FORMAT.split(',')
    : ['cli', 'html'],
  USER_ID_BY_ADMIN: '0bcb0d86-09bb-410a-b2b1-fba90d1a7699',
  USER_ID_BY_TESTER: 'bdcb113f-6715-40fd-8dab-14aa01327ae9',
  PROVIDER_ID_BY_ADMIN: '7637ae1a-3b7c-44eb-a5ed-10ea02f1885d',
  PROVIDER_ID_BY_TESTER: '4df1f70b-52e8-4e55-b79b-15ffc2c6a4f6',
  SKILL_ID_BY_ADMIN: '0aec2956-cbcb-4c80-8c00-25cc02a71611',
  SKILL_ID_BY_TESTER: '9ad4eb94-4029-49ff-b01a-9ac0a964dd35',
  ROLE_ID_BY_ADMIN: '8607ddb3-abf6-4512-a618-c60d4771174b',
  ROLE_ID_BY_TESTER: '58fffc97-db2a-48a7-9066-cfc83bbde7b5',
  ORGANIZATION_ID_BY_ADMIN: 'a866fd95-c2d5-4fa8-b341-a367138c9911',
  ORGANIZATION_ID_BY_TESTER: 'f1e7cf4d-e688-4037-980e-820f12c822d9',
  ACHIEVEMENTS_PROVIDER_ID_BY_ADMIN: 'b1b22eba-ba1b-4740-8f70-da607de52ce7',
  ACHIEVEMENTS_PROVIDER_ID_BY_TESTER: '1ad72e52-4b44-4634-9c02-4e792c156b43',
  ATTRIBUTE_GROUP_ID_BY_ADMIN: '03df695f-0b97-4fe3-ae29-17f1aa0addc4',
  ATTRIBUTE_GROUP_ID_BY_TESTER: '8599dbcb-7301-46a1-ab23-7b3dfd610f26',
  ATTRIBUTE_ID_BY_ADMIN: '5c22a53f-6530-4f92-b934-64cc9b05f1d0',
  ATTRIBUTE_ID_BY_TESTER: 'a15f160c-5634-4af5-9967-cc4b28bdc94c',
  ACHIEVEMENT_ID_BY_ADMIN: '9a771c88-1e57-4a47-bf20-a9a62c118237',
  ACHIEVEMENT_ID_BY_TESTER: '6499865c-6cb6-49c1-991f-be95fb03ed56'
}
```
In the provided sample `config/test.js` file, notice that some configuration parameters values are hard-coded (USER_ID_BY_ADMIN, USER_ID_BY_TESTER ... ) and some are read from environment variables(ADMIN_CREDENTIALS_USERNAME, ADMIN_CREDENTIALS_PASSWORD...)

As a rule of thumb, it is always recommended, or even required in some cases, to use environment variables for configuring sensitive data like passwords, tokens, auth secrets ...etc

3. Calling the testing lib to test against inner defined tests
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
     iterationData is optional, it is provided only when the iteration data is used by the test
   - `collectionFileFullPath` is the full file path of the postman collection file.
   - `environmentFileFullPath` is the full file path of the postman environment file.

For example to run sample tests for skill-api:
```js
const apiTestLib = require('tc-api-testing-lib')
const requests = [
   {
      folder: 'create taxonomy by admin',
      iterationData: require('./testData/taxonomy/create-taxonomy-by-admin.json')
   },
   {
      folder: 'create skill by admin',
      iterationData: require('./testData/skill/create-skill-by-admin.json')
   },
   {
      folder: 'head taxonomies by admin'
   },
   {
      folder: 'delete skill by admin'
   }
]
apiTestLib.runTests(requests, require.resolve('./skill-api.postman_collection.json'),
  require.resolve('./skill-api.postman_environment.json')).then(async () => {
  logger.info('newman test completed!')
  // add instruction to clear test data
}).catch(async (err) => {
  logger.logFullError(err)
  // Only calling the clean up function when it is not validation error.
  if (err.name !== 'ValidationError') {
    // add instruction to clear test data
  }
})
```

The sample content of the `./testData/taxonomy/create-taxonomy-by-admin.json` is like the following:
- input: is the input data to send in the request body
- expected: is the expected response from the skill-api
- idLabel: is the name of the variable to use to save the id of the created taxonomy, it will be used by subsequent tests (for example create skill test)
- httpCode: if the expected Http status code
```json
[
   {
      "input": {
         "name": "POSTMANE2E-taxonomy_01_by_admin",
         "metadata": {
            "random_field_01": "random_value_01_by_admin"
         }
      },
      "expected": {
         "name": "POSTMANE2E-taxonomy_01_by_admin",
         "metadata": {
            "random_field_01": "random_value_01_by_admin"
         }
      },
      "idLabel": "TAXONOMY_1",
      "httpCode": 200
   },
   {
      "input": {
         "name": "POSTMANE2E-taxonomy_02_by_admin",
         "metadata": {
            "abc": "random_value_02_by_admin",
            "efg": 123
         }
      },
      "expected": {
         "name": "POSTMANE2E-taxonomy_02_by_admin",
         "metadata": {
            "abc": "random_value_02_by_admin",
            "efg": 123
         }
      },
      "idLabel": "TAXONOMY_2",
      "httpCode": 200
   },
   {
      "input": {
         "name": "POSTMANE2E-taxonomy_03_by_admin"
      },
      "expected": {
         "name": "POSTMANE2E-taxonomy_03_by_admin"
      },
      "idLabel": "TAXONOMY_3",
      "httpCode": 200
   }
]

```
The sample content of the `./testData/skill/create-skill-by-admin.json` mentioned above is like:
- input: is the input data to send in the request body of the API call, notice that it uses `{{TAXONOMY_1}}` variable which is expected to be set by a previous test (create Taxonomy test above)
- expected: is the expected response from the API
- idLabel: is the postman environment variable to use to store the id of the created skill to be used in subsequent tests (delete skill test for example)
- httpCode: is the expected Http status code for this test
```json
[
  {
    "input": {
      "name": "POSTMANE2E-skill_01_by_admin",
      "taxonomyId":"{{TAXONOMY_1}}",
      "uri":"http://www.google.com",
      "externalId":"externalId_01",
      "metadata": {
        "challengeProminence": "0.2",
        "memberProminence": "0.5"
      }
    },
    "expected": {
      "name": "POSTMANE2E-skill_01_by_admin",
      "uri":"http://www.google.com",
      "externalId":"externalId_01",
      "metadata": {
        "challengeProminence": "0.2",
        "memberProminence": "0.5"
      }
    },
    "idLabel": "SKILL_1",
    "httpCode": 200
  },
  {
    "input": {
      "name": "POSTMANE2E-skill_02_by_admin",
      "taxonomyId":"{{TAXONOMY_1}}",
      "uri":"http://www.google.com",
      "externalId":"externalId_01",
      "metadata": {
      }
    },
    "expected": {
      "name": "POSTMANE2E-skill_02_by_admin",
      "uri":"http://www.google.com",
      "externalId":"externalId_01",
      "metadata": {
      }
    },
    "idLabel": "SKILL_2",
    "httpCode": 200
  },
  {
    "input": {
      "name": "POSTMANE2E-skill_03_by_admin",
      "taxonomyId":"{{TAXONOMY_2}}",
      "metadata": {
      }
    },
    "expected": {
      "name": "POSTMANE2E-skill_03_by_admin",
      "metadata": {
      }
    },
    "idLabel": "SKILL_3",
    "httpCode": 200
  }
]
```

Then, in Postman create a test for each folder defined in the `requests` array with the same name.
For example, for:
```
{
  folder: 'create taxonomy by admin',
  iterationData: require('./testData/taxonomy/create-taxonomy-by-admin.json')
}
```
Create a request in postman with the same name `create taxonomy by admin`
In Pre-request Script tab in Postman add the following code (which reads the input field from the iterationData file and sets it in `input_body` environment variable in Postman):
```js
var inputJSONdata = pm.iterationData.get("input");
pm.variables.set("input_body",JSON.stringify(inputJSONdata));
```
See: https://take.ms/h93CyM

In the request body of the test, use the postman environment variable set above `{{input_body}}`: https://take.ms/rICh8

And, in the Tests tab in Postman add the following code:
```js
const iterationData = pm.iterationData
const httpCode = iterationData.get('httpCode')
pm.test(`Status code is ${httpCode}`, function () {
    pm.response.to.have.status(httpCode);
    const response = pm.response.json()
    const iterationData = pm.iterationData
    const expected = iterationData.get('expected')
    for (let key of Object.keys(expected)) {
        if (_.isObject(response[key])) {
            pm.expect(_.isMatch(response[key], expected[key])).to.eq(true)
        } else {
            pm.expect(_.isEqual(response[key], expected[key])).to.eq(true)
        }
    }
    if (iterationData.get('idLabel')) {
        const idLabel = iterationData.get('idLabel')
        pm.environment.set(idLabel, response.id)
    }
});
```
It will check if the Http status code matches the expected one (which was set in the iterationData json file)

It will also check if the received response matches the expected one which was set in the iterationData json file `./testData/taxonomy/create-taxonomy-by-admin.json`

And will set the id of the created taxonomy as a Postman environment variable using the the `idLabel` from the iterationData json file

The same steps can be followed for the `create skill by admin` test, see:

- https://monosnap.com/direct/nJz539Bozh5aRwJrIvPPPhJq7OweDC
- https://monosnap.com/direct/CwVoQVSN2NzoYvBoT0uXnyxu417HXF
- https://monosnap.com/direct/tYY9nGHZUiDRQwnwnjhtDS1va2huZN

Similar steps can be followed to set up the other tests: `head taxonomies by admin` and `delete skill by admin`

4. How to execute the tests and collect the results:

As described above, we can run the tests by running `NODE_ENV=test node test/postman/newman.js` from command line, `newman.js` is the main file responsible for running the newman tests (See step 3 above)

You can add this command as a script in `scripts` section in `package.json` file of the caller API: `"test:newman": "NODE_ENV=test node test/postman/newman.js"` and run `npm run test:newman` from command line

You should be able to find the tests result from the command window of running `npm run test:newman` for each test case.
Below is a sample output result of `create taxonomy`:

```
skill-api

Iteration 1/3

❏ taxonomies / create taxonomy
↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 449B, 84ms]
  ✓  Status code is 200

Iteration 2/3

↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 447B, 34ms]
  ✓  Status code is 200

Iteration 3/3

↳ create taxonomy by admin
  POST http://127.0.0.1:3001/api/1.0/taxonomies [200 OK, 404B, 33ms]
  ✓  Status code is 200

┌─────────────────────────┬───────────────────┬──────────────────┐
│                         │          executed │           failed │
├─────────────────────────┼───────────────────┼──────────────────┤
│              iterations │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│                requests │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│            test-scripts │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│      prerequest-scripts │                 3 │                0 │
├─────────────────────────┼───────────────────┼──────────────────┤
│              assertions │                 3 │                0 │
├─────────────────────────┴───────────────────┴──────────────────┤
│ total run duration: 273ms                                      │
├────────────────────────────────────────────────────────────────┤
│ total data received: 496B (approx)                             │
├────────────────────────────────────────────────────────────────┤
│ average response time: 50ms [min: 33ms, max: 84ms, s.d.: 23ms] │
└────────────────────────────────────────────────────────────────┘
```

5. The CircleCI can get the aggregated text summary like:
```text
────────────────────────────────────────────────────────────────────
Total tests: 115	Success: 111	Failures: 4 
info: newman test completed!
info: Clear the Postman test data.
Report saved
info: Finished clear the Postman test data.
```

### Testing results logs
The testing reporter files will be generated in the caller's `newman` folder. As the script to run tests are usually `npm run test:newman`, just use the `newman` as the testing results' folder.
`templates/report.html` is the template for the aggregated reports. As the newman does not provide the aggregated reports, test results will use this template to generate one.   
*The aggregated reports will be generated in the caller's `newman` folder too, named `reports.html`.*


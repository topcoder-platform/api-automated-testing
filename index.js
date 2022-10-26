const newman = require('newman')
const config = require('config')
const _ = require('lodash')
const Joi = require('joi')
const fs = require('fs')
const Handlebars = require('handlebars')
const envHelper = require('./envHelper')

/**
 * Total tests runs.
 * @type {number}
 */
let executions = 0
/**
 * Total failures.
 * @type {number}
 */
let failures = 0
/**
 * Data to generate the testing report.
 * @type {object}
 */
const reportData = { folders: [] }

const runner = (options) => new Promise((resolve, reject) => {
  newman.run(options, function (err, results) {
    if (err) {
      reject(err)
      return
    }
    resolve(results)
  })
})

/**
 * Sleep for the given time
 * @param ms the milliseconds
 * @returns {Promise<unknown>}
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Validate all the required configurations first.
 * @return {Promise<void>}
 */
async function checkConfigFiles () {
  const schema = Joi.object({
    AUTH0_CLIENT_ID: Joi.string().required(),
    AUTH0_CLIENT_SECRET: Joi.string().required(),
    AUTH_V2_URL: Joi.string().required(),
    AUTH_V2_CLIENT_ID: Joi.string().required(),
    AUTH_V3_URL: Joi.string().required(),
    ADMIN_CREDENTIALS_USERNAME: Joi.string().required(),
    ADMIN_CREDENTIALS_PASSWORD: Joi.string().required(),
    MANAGER_CREDENTIALS_USERNAME: Joi.string().required(),
    MANAGER_CREDENTIALS_PASSWORD: Joi.string().required(),
    COPILOT_CREDENTIALS_USERNAME: Joi.string().required(),
    COPILOT_CREDENTIALS_PASSWORD: Joi.string().required(),
    USER_CREDENTIALS_USERNAME: Joi.string().required(),
    USER_CREDENTIALS_PASSWORD: Joi.string().required(),
    WAIT_TIME: Joi.number().positive().required(),
    AUTOMATED_TESTING_REPORTERS_FORMAT:
      Joi.array().items(Joi.string().valid('cli', 'json', 'junit', 'html').required()).required()
  }).unknown(true)
  await schema.validateAsync(config)
}

/**
 * Convert the duration from milliseconds to minutes and seconds
 * @param millis the milliseconds
 * @return {string} the converted result
 */
function convertDuration (millis) {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ' m ' + seconds + ' s'
}

/**
 * Output the execution results to the CircleCI.
 * @param startTime the start time of the newman tests.
 */
function outputResults (startTime) {
  const endTime = Date.now()
  reportData.totalTime = convertDuration(endTime - startTime)
  reportData.totalCount = executions
  reportData.totalFailures = failures
  console.info('────────────────────────────────────────────────────────────────────')
  console.info(`Total tests: ${executions}\tSuccess: ${executions - failures}\tFailures: ${failures} `)
  fs.readFile(require.resolve('./templates/report.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const template = Handlebars.compile(data)
    const report = template(reportData)
    fs.writeFile('./newman/reports.html', report, err => {
      if (err) {
        return console.error(`Failed to store report: ${err.message}.`)
      }
      console.info('Report saved')
    })
  })
}

/**
 * Run the postman tests.
 * @param requests the postman requests
 * @param collectionPath the file path of the postman collection
 * @param environmentPath the file path of the postman environment
 * @return {Promise<void>}
 */
async function runTests (requests, collectionPath, environmentPath) {
  const startTime = Date.now()
  await checkConfigFiles()
  // how many tests/iterations in the requests provided ?
  let tests = 0
  for (const req of requests) {
    if (req.iterationData) {
      tests += req.iterationData.length
    } else {
      tests += 1
    }
  }
  console.info(`\t        Number of Requests to Run : ${requests.length}\n`)
  console.info(`\tNumber of Tests/Iterations to Run : ${tests}\n`)
  const m2mToken = await envHelper.getM2MToken()
  const adminToken = await envHelper.getAdminToken()
  const managerToken = await envHelper.getManagerToken()
  const copilotToken = await envHelper.getCopilotToken()
  const userToken = await envHelper.getUserToken()
  let originalEnvVars = [
    { key: 'm2m_token', value: `Bearer ${m2mToken}` },
    { key: 'M2M_TOKEN', value: `Bearer ${m2mToken}` },
    { key: 'admin_token', value: `Bearer ${adminToken}` },
    { key: 'manager_token', value: `Bearer ${managerToken}` },
    { key: 'copilot_token', value: `Bearer ${copilotToken}` },
    { key: 'user_token', value: `Bearer ${userToken}` }
  ]
  // Apps that set `Bearer ` prefix themselves
  const haveBearerPrefix = [
    'Ubahn-api',
    'project-api',
    'resource-api',
    'groups-api'
  ]
  const testCases = require(environmentPath).name
  if (haveBearerPrefix.includes(testCases)) {
    originalEnvVars = [
      { key: 'm2m_token', value: `${m2mToken}` },
      { key: 'M2M_TOKEN', value: `${m2mToken}` },
      { key: 'admin_token', value: `${adminToken}` },
      { key: 'manager_token', value: `${managerToken}` },
      { key: 'copilot_token', value: `${copilotToken}` },
      { key: 'user_token', value: `${userToken}` }
    ]
  }
  if (testCases === 'Ubahn-api') {
    originalEnvVars.push(
      { key: 'USER_ID_BY_ADMIN', value: config.USER_ID_BY_ADMIN },
      { key: 'USER_ID_BY_TESTER', value: config.USER_ID_BY_TESTER },
      { key: 'PROVIDER_ID_BY_ADMIN', value: config.PROVIDER_ID_BY_ADMIN },
      { key: 'PROVIDER_ID_BY_TESTER', value: config.PROVIDER_ID_BY_TESTER },
      { key: 'SKILL_ID_BY_ADMIN', value: config.SKILL_ID_BY_ADMIN },
      { key: 'SKILL_ID_BY_TESTER', value: config.SKILL_ID_BY_TESTER },
      { key: 'ROLE_ID_BY_ADMIN', value: config.ROLE_ID_BY_ADMIN },
      { key: 'ROLE_ID_BY_TESTER', value: config.ROLE_ID_BY_TESTER },
      { key: 'ORGANIZATION_ID_BY_ADMIN', value: config.ORGANIZATION_ID_BY_ADMIN },
      { key: 'ORGANIZATION_ID_BY_TESTER', value: config.ORGANIZATION_ID_BY_TESTER },
      { key: 'ACHIEVEMENTS_PROVIDER_ID_BY_ADMIN', value: config.ACHIEVEMENTS_PROVIDER_ID_BY_ADMIN },
      { key: 'ACHIEVEMENTS_PROVIDER_ID_BY_TESTER', value: config.ACHIEVEMENTS_PROVIDER_ID_BY_TESTER },
      { key: 'ATTRIBUTE_GROUP_ID_BY_ADMIN', value: config.ATTRIBUTE_GROUP_ID_BY_ADMIN },
      { key: 'ATTRIBUTE_GROUP_ID_BY_TESTER', value: config.ATTRIBUTE_GROUP_ID_BY_TESTER },
      { key: 'ATTRIBUTE_ID_BY_ADMIN', value: config.ATTRIBUTE_ID_BY_ADMIN },
      { key: 'ATTRIBUTE_ID_BY_TESTER', value: config.ATTRIBUTE_ID_BY_TESTER },
      { key: 'ACHIEVEMENT_ID_BY_ADMIN', value: config.ACHIEVEMENT_ID_BY_ADMIN },
      { key: 'ACHIEVEMENT_ID_BY_TESTER', value: config.ACHIEVEMENT_ID_BY_TESTER }
    )
  } else if (testCases === 'project-api') {
    originalEnvVars.push(
      { key: 'ADMIN_ID', value: config.ADMIN_ID },
      { key: 'USER_ID', value: config.USER_ID },
      { key: 'COPILOT_ID', value: config.COPILOT_ID },
      { key: 'POSTMAN_UPLOADED_FILES_PATH', value: config.POSTMAN_UPLOADED_FILES_PATH },
      { key: 'POSTMAN_S3_BUCKET', value: config.POSTMAN_S3_BUCKET }
    )
  } else {
    //
  }

  const options = {
    collection: collectionPath,
    exportEnvironment: environmentPath,
    reporters: config.AUTOMATED_TESTING_REPORTERS_FORMAT
  }

  for (const request of requests) {
    options.envVar = [
      ...originalEnvVars,
      ..._.map(_.keys(request.iterationData || {}), key => ({ key, value: request.iterationData[key] }))
    ]
    delete require.cache[environmentPath]
    options.environment = require(environmentPath)
    options.folder = request.folder
    options.iterationData = _.map(request.iterationData, data => {
      if (data.requestBody) {
        data.requestBody = JSON.stringify(data.requestBody)
      }
      return data
    })
    try {
      const requestStart = Date.now()
      const results = await runner(options)
      const runs = _.get(results, 'run.executions.length', 0)
      const failed = _.get(results, 'run.failures.length', 0)
      const spentTime = Date.now() - requestStart
      reportData.folders.push({ folder: request.folder, total: runs, failed: failed, spentTime: `${spentTime} ms` })
      executions += runs
      failures += failed
      if (failed > 0) {
        outputResults(startTime)
        return
      }
    } catch (err) {
      console.log(err)
    }
    await sleep(config.WAIT_TIME)
  }
  outputResults(startTime)
}

module.exports = {
  runTests
}

import dns from 'node:dns'

const {generate} = require('multiple-cucumber-html-reporter');
const { removeSync } = require('fs-extra');
const reportConfig = require('./systemIntegration/utils/reportConfiguration');
const yargs = require('yargs');

const parseCmdArgs = () => yargs.argv;
const getCmdArgs = () => parseCmdArgs();
const getRunOnSauce = () => getCmdArgs().runOnSauce || false;

exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    //
    // =================
    // Service Providers
    // =================
    // WebdriverIO supports Sauce Labs, Browserstack, Testing Bot and LambdaTest (other cloud providers
    // should work too though). These services define specific user and key (or access key)
    // values you need to put in here in order to connect to these services.
    //
    user: process.env.SAUCE_USERNAME || '',
    key: process.env.SAUCE_ACCESS_KEY || '',
    //hostname: 'saucelabs.com',
    port: 443,
    path: '/wd/hub',
    //
    // If you run your tests on Sauce Labs you can specify the region you want to run your tests
    // in via the `region` property. Available short handles for regions are `us` (default), `eu` and `apac`.
    // These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
    // If you don't provide the region it will default for the `us`
    region: 'us',

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // If you are calling `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script),
    // then the current working directory is where your `package.json` resides, so `wdio`
    // will be called from there.
    //
   
    specs: [
        './systemIntegration/features/*.feature',
    ],
   

    /* exclude: [
     ],*/
   // services: ['devtools'],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,
    capabilities: getRunOnSauce() === 'false' ?
        [{
            maxInstances: 1,
            browserName: 'chrome',
            // 'goog:chromeOptions': {
            //     args: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1680,1050"]
            // },

            acceptInsecureCerts: true,
            'cjson:metadata': {
                browser: {
                    name: 'chrome',
                    version: '127',
                },

                device: 'Dell',
                platform: {
                    name: 'Windows',
                    version: '10'
                }
            }

        }] : [{

            maxInstances: 1,
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'Windows 11',
            'sauce:options': {
              //  screenResolution: '1920x1080',
                // build: '<your build id>',
                name: 'Chrome',
            },
            acceptInsecureCerts: true,
      

        },
           
        ],
    logLevel: 'debug', // 'info', 'error', 'silent'
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 120000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,
   /* services: [
        ['chromedriver', {
            logFileName: 'wdio-chromedriver.log', // default
            outputDir: 'driver-logs', // overwrites the config.outputDir
            args: ['--silent']
        }]
    ],*/
    services: getRunOnSauce() === 'false' ? //['chromedriver', 'intercept'] : ['sauce', 'intercept'],
        [
            ['chromedriver', {
                logFileName: 'wdio-chromedriver.log', // default
                outputDir: 'driver-logs', // overwrites the config.outputDir
                chromedriverCustomPath: 'C:\\Users\\smtripat\\git\\master\\AmexOnline\\src\\test\\resources\\Browser_EXE\\ChromeDriver\\chromedriver.exe',
                args: ['--silent']
            }]
        ] : ['sauce', 'intercept'],
    framework: 'cucumber',
    reporters: ['spec',
        ['cucumberjs-json', {
            jsonFolder: './cucumber-reports/cucumber-json',
            language: 'en',
            reportFilePerRetry: true,
            //requireModule: 'ts-node/register',
            //format: '@saucelabs/cucumber-reporter'

        }]

    ],
 
    cucumberOpts: {
        require: ['./systemIntegration/stepDefinitions/**/*.js'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 300000,
        ignoreUndefinedDefinitions: false
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    onPrepare: () => {
        // Remove the folder that holds the json and report files
        removeSync('./cucumber-reports/');
    },
    /**
     * Gets executed before a worker process is spawned and can be used to initialise specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {[type]} specs    specs to
     * be run in the worker process
     * @param  {[type]} args     object that will be merged with the main configuration once worker is initialized
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {String} cid      capability id (e.g 0-0)
     * @param  {Number} exitCode 0 - success, 1 - fail
     * @param  {[type]} specs    specs to be run in the worker process
     * @param  {Number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {String} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {Object}         browser      instance of created browser/device session
     */
    before: function (capabilities, specs) {
        browser.maximizeWindow(),
            browser.addCommand("waitAndClick", async function () {
                // `this` is return value of $(selector)
                await this.waitForDisplayed()
                await this.click({force: true})
            }, true)

        /*   browser.overwriteCommand('click', async function (origClickFunction, {force = false} = {}) {
               if (!force) {
                   try {
                       // attempt to click
                       await origClickFunction()
                       return null
                   } catch (err) {
                       if (err.message.includes('not clickable at point')) {
                           console.warn('WARN: Element', this.selector, 'is not clickable.',
                               'Scrolling to it before clicking again.')

                           // scroll to element and click again
                           await this.scrollIntoView()
                           return origClickFunction()
                       }
                       throw err
                   }
               }

               // clicking with js
               console.warn('WARN: Using force click for', this.selector)
               await browser.execute((el) => {
                   el.click()
               }, this)
           }, true)*/
    },

    beforeEach:function (){

    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Cucumber Hooks
     *
     * Runs before a Cucumber Feature.
     * @param {String}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // beforeFeature: function (uri, feature) {
    // },
    /**
     *
     * Runs before a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world    world object containing information on pickle and test step
     * @param {Object}                 context  Cucumber World object
     */
    // beforeScenario: function (world, context) {
    // },
    /**
     *
     * Runs before a Cucumber Step.
     * @param {Pickle.IPickleStep} step     step data
     * @param {IPickle}            scenario scenario pickle
     * @param {Object}             context  Cucumber World object
     */
    // beforeStep: function (step, scenario, context) {
    // },

    /**
     *
     * Runs after a Cucumber Step.
     * @param {Pickle.IPickleStep} step             step data
     * @param {IPickle}            scenario         scenario pickle
     * @param {Object}             result           results object containing scenario results
     * @param {boolean}            result.passed    true if scenario has passed
     * @param {string}             result.error     error stack if scenario failed
     * @param {number}             result.duration  duration of scenario in milliseconds
     * @param {Object}             context          Cucumber World object
     */
    afterStep: function (step, scenario, { error, duration, passed }) {
        reportConfig.attachImageToCucumberReport()
    },

    /**
     *
     * Runs after a Cucumber Scenario.
     * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
     * @param {Object}                 result           results object containing scenario results
     * @param {boolean}                result.passed    true if scenario has passed
     * @param {string}                 result.error     error stack if scenario failed
     * @param {number}                 result.duration  duration of scenario in milliseconds
     * @param {Object}                 context          Cucumber World object
     */


    /**
     *
     * Runs after a Cucumber Feature.
     * @param {String}                   uri      path to feature file
     * @param {GherkinDocument.IFeature} feature  Cucumber feature object
     */
    // afterFeature: function (uri, feature) {
    // },

    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    onComplete: () => {
        generate(reportConfig.getReportOptions());
    },

    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    //debug: true,
}
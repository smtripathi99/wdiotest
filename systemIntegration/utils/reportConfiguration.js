import cucumberJson from 'wdio-cucumberjs-json-reporter';

module.exports.getReportOptions = () => ({
    jsonDir: './cucumber-reports/cucumber-json/',
    reportPath: './cucumber-reports/cucumber-html/',
    openReportInBrowser: true,
    disableLog: true,
    ignoreBadJsonFile: true,
    pageTitle: 'Test',
    reportName: 'testreport',
    displayDuration: true,
    customData: {
        title: 'Run info',
        data: [
            { label: 'Environment', value: 'E2' },
            { label: 'Project', value: 'Demo' },
            {label: 'Application', value: 'Test'},
          

        ],
    },

    pageFooter: '<div style="margin:0 auto;width:50%;padding:10px;">'
        + '<p>Regression Report</p></div>',
});

module.exports.attachImageToCucumberReport = async() => cucumberJson.attach(await browser.takeScreenshot(), 'image/png');

module.exports.attachDataToCucumberReport = data => cucumberJson.attach(JSON.stringify(data, undefined, 4), 'application/json');

module.exports.attachTextToCucumberReport = text => cucumberJson.attach(text, 'text/plain');

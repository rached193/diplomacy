/* Primarily inspired by:
 * - https://github.com/marmelab/ng-admin/blob/master/src/javascripts/test/protractor.conf.js
 * - https://github.com/angular/angular.js/blob/master/protractor-shared-conf.js
 */
exports.config = {
    // sauce plz
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    baseUrl: 'http://localhost:9000',

    specs: ['e2e/**/*.spec.js'],
    framework: 'jasmine',
    maxSessions: 1,
    allScriptsTimeout: 30000,
    rootElement: 'html',
    multiCapabilities: [
        capabilitiesForBrowser('chrome', '41'),
        capabilitiesForBrowser('firefox'),
        capabilitiesForBrowser('safari')
    ],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 360000,
        includeStackTrace: true
    }
};

function capabilitiesForBrowser(browserName, browserVersion) {
    var capabilities = {
        'browserName': browserName,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'dipl.io'
    };
    if (browserVersion)
        capabilities.version = browserVersion;

    return capabilities;
}

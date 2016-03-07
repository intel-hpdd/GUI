'use strict';

if (process.env.RUNNER === 'CI') {
  var jasmineJUnitReporter = require('intel-jasmine-junit-reporter');

  var junitReporter = jasmineJUnitReporter({
    specTimer: new jasmine.Timer(),
    JUnitReportSavePath: process.env.SAVE_PATH || './',
    JUnitReportFilePrefix: process.env.FILE_PREFIX || 'gulp-results',
    JUnitReportSuiteName: 'Gulp Reports',
    JUnitReportPackageName: 'Gulp Reports'
  });

  jasmine.getEnv().addReporter(junitReporter);
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

module.exports = function (config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    files: [
      // paths loaded by Karma
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},
      {pattern: 'dest/source/system.config.js', included: true, watched: true},
      {pattern: 'karma-test-shim.js', included: true, watched: true},

      // paths loaded via module imports
      {pattern: 'dest/node_modules/**/*.js', included: false, watched: true},
      {pattern: 'dest/bower_components/**/*.js', included: false, watched: true},
      {pattern: 'dest/source/iml/**/*.js', included: false, watched: true},
      {pattern: 'dest/source/iml/**/*.html', included: false, watched: true},
      {pattern: 'dest/test/**/*.js', included: false, watched: true}
    ],
    proxies: {
      '/static/chroma_ui/': '/base/dest/'
    },
    reporters: ['progress'],
    junitReporter: {
      outputDir: 'test-results',
      suite: 'karma-tests (new ui)'
    },
    coverageReporter: {
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'cobertura',
          dir: 'coverage/'
        },
        {
          type: 'html',
          dir: 'coverage/'
        }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeNoProxy', 'Firefox'],
    customLaunchers: {
      ChromeNoProxy: {
        base: 'Chrome',
        flags: ['--no-proxy-server']
      }
    },
    captureTimeout: 60000,
    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 60000,
    singleRun: false
  });
};

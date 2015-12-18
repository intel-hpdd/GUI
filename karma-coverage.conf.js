var baseConfig = require('./karma.conf.js');
var obj = require('intel-obj');


module.exports = function(config) {
  'use strict';

  baseConfig(config);

  config.set({
    reporters: ['coverage'],

    preprocessors: obj.merge({}, config.preprocessors, {
      'source/chroma_ui/!(vendor|bower_components)/**/*.js': ['coverage']
    }),
    coverageReporter: {
      instrumenters: { isparta : require('isparta') },
      instrumenter: {
        '**/*.js': 'isparta'
      },
      reporters: [
        {
          type: 'text-summary'
        },
        {
          type: 'cobertura',
          dir: 'coverage/'
        }
      ]
    }
  });
};

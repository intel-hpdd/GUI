var gulp = require('gulp');
var paths = require('../paths.json');
var js = require('./js');
var css = require('./css');
var assets = require('./assets');

const watchers = [];

module.exports = function watch (done) {
  watchers = [
    gulp.watch(paths.js.source, js.jsSourceDev),
    gulp.watch([paths.js.deps, paths.js.config], js.jsDepsDev),
    gulp.watch(paths.assets.templates, assets.templatesDev),
    gulp.watch([paths.assets.fonts, paths.assets.images], assets.assetsDev),
    gulp.watch(paths.js.tests, js.jsTest),
    gulp.watch(paths.js.testDeps, js.jsTestDeps),
    gulp.watch(paths.less.imports, css.buildCssDev)
  ];

  process.on('SIGINT', cleanShutdown);
  process.on('SIGTERM', cleanShutdown);

  done();
};

function cleanShutdown (x) {
  console.log('Shutting down watch');
  watchers.forEach(function (w) {
    w.close();
  });

  process.exit(0);
};

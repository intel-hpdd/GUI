var gulp = require('gulp');
var paths = require('../paths.json');
var js = require('./js');
var css = require('./css');
var templates = require('./templates');
var assets = require('./assets');

module.exports = function watch () {
  gulp.watch(paths.js.source, js.jsSourceDev);
  gulp.watch(paths.js.deps, js.jsDepsDev);
  gulp.watch(paths.js.config, js.jsDepsDev);
  gulp.watch(paths.templates.angular, templates.ngDev);
  gulp.watch([paths.assets.fonts, paths.assets.images], assets.assetsDev);
  gulp.watch(paths.js.tests, js.jsTest);
  gulp.watch(paths.js.testDeps, js.jsTestDeps);
  gulp.watch(paths.less.imports, css.buildCssDev);
};

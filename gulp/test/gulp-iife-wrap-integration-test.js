'use strict';

var λ = require('highland');
var path = require('path');
var childProcess = require('child_process');
var exec = childProcess.exec;
var fs = require('fs');
var del = require('del');

describe('gulp iife wrap integration', function () {
  var gulp, contents, distributeDir, commonPath, imlPath, bowerComponentsPath, iifeRegex;

  beforeAll(function runGulp (done) {
    gulp = path.resolve(path.dirname(__dirname) + '/../node_modules/.bin/gulp');
    contents = exec(gulp + ' --dest-dir=test/OUTPUT_DIR prod');
    contents.stdout.setEncoding('utf8');

    λ(contents.stdout)
      .collect()
      .stopOnError(done.fail)
      .map(console.log)
      .each(done);

    handleStdErr(contents, done);
  });

  beforeEach(function () {
    distributeDir = path.resolve(__dirname + '/OUTPUT_DIR/chroma_ui/static/chroma_ui');

    commonPath = 'common';
    imlPath = 'iml';
    bowerComponentsPath = 'bower_components';

    iifeRegex = /^\(function\(\)\{\n'use strict';(?:.|\n)+}\(\)\);$/m;
  });

  afterAll(function (done) {
    del([ path.join(__dirname, '/OUTPUT_DIR/chroma_ui')], {force: true}, done);
  });

  it('should wrap every javascript file under the common directory', function () {
    getDirTreeSync(path.join(distributeDir, commonPath), function assert (fileContents) {
      expect(iifeRegex.test(fileContents)).toBe(true);
    });
  });

  it('should wrap every javascript file under the iml directory', function () {
    getDirTreeSync(path.join(distributeDir, imlPath), function assert (fileContents) {
      expect(iifeRegex.test(fileContents)).toBe(true);
    });
  });

  it('should not wrap any javascript files under the bower_components directory', function () {
    getDirTreeSync(path.join(distributeDir, bowerComponentsPath), function assert (fileContents) {
      expect(iifeRegex.test(fileContents)).toBe(false);
    });
  });

});

function getDirTreeSync (dir, assert) {
  return fs.readdirSync(dir)
    .forEach(function processFile (file) {
      var filePath = path.join(dir, file);

      var s = fs.statSync(filePath);

      if (s.isFile() && /\.js$/.test(filePath))
        assert(fs.readFileSync(filePath, 'utf8'));
      if (s.isDirectory())
        getDirTreeSync(filePath + '/', assert);

    });
}

function handleStdErr (x, done) {
  λ(x.stderr)
    .each(done.fail);
}

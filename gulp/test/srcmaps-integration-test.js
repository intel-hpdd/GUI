'use strict';

var λ = require('highland');
var path = require('path');
var childProcess = require('child_process');
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var del = require('del');

describe('Srcmapped file', function () {
  var gulp, contents, url, name;

  beforeAll(function createSrcMap (done) {
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

  beforeAll(function (done) {
    contents = runShell(spawn, 'tail -n 1 ' + path.join(__dirname, 'OUTPUT_DIR/chroma_ui/static/chroma_ui/built-*.js'));

    λ(contents.stdout)
      .collect()
      .invoke('join', [])
      .tap(function (x) {
        url = x;
      })
      .stopOnError(done.fail)
      .each(done);

    handleStdErr(contents, done);
  });

  beforeAll(function (done) {
    contents = runShell(spawn, 'basename ' + path.join(__dirname, 'OUTPUT_DIR/chroma_ui/static/chroma_ui/built-*.map'));

    λ(contents.stdout)
      .tap(function (x) {
        name = x.split('\n')[0];
      })
      .stopOnError(done.fail)
      .each(done);

    handleStdErr(contents, done);
  });

  afterAll(function (done) {
    del([ path.join(__dirname, '/OUTPUT_DIR/chroma_ui')], {force: true}, done);
  });

  it('should have src map url at the bottom', function () {
    expect(url).toContain('//# sourceMappingURL');
  });

  it('should have a hash that matches the srcmap', function () {
    expect(url).toContain(name);
  });
});

function runShell (f, x) {
  var s = f('/bin/sh', ['-c', x]);
  s.stdout.setEncoding('utf8');

  return s;
}

function handleStdErr (x, done) {
  λ(x.stderr)
    .each(done.fail);
}

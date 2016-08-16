// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
window.__karma__.loaded = function () {};

var testFiles = Object.keys(window.__karma__.files)
  .filter(f => /\/.+-test\.js$/.test(f))
  .map(f => f.replace(/^\//, ''))
  .map(f => f.replace(/^base\/dest\//, ''));

System
  .import('/base/dest/test/global-setup.js')
  .then(() => System.import('/base/dest/node_modules/intel-jasmine-n-matchers/jasmine-n-matchers'))
  .then(
    () => Promise
      .all(
        testFiles
        .map(f => System.import(f))
      )
  )
  .then(
    () => window.__karma__.start(),
    error => window.__karma__.error(error.message + ' ' + error.stack)
  );

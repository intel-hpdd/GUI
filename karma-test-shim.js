// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
window.__karma__.loaded = function () {};

System.baseURL = '/base/dest/';

System.meta = Object.keys(System.meta)
  .reduce(function (obj, key) {
    var testKey = key.replace(/^.+static\/chroma_ui\//, window.location.origin + '/base/dest/');

    obj[testKey] = System.meta[key];

    return obj;
  }, {});

var testFiles = Object.keys(window.__karma__.files)
  .filter(onlySpecFiles)
  .map(filePath2moduleName);

System.import('/base/dest/test/global-setup.js')
  .then(() => System.import('/base/dest/node_modules/intel-jasmine-n-matchers/jasmine-n-matchers'))
  .then(() => Promise.all(testFiles
    .map(moduleName => System.import(moduleName.replace(/^base\/dest\//, '')))
  ))
  .then(function () {
    window.__karma__.start();
  }, function (error) {
    window.__karma__.error(error.message + ' ' + error.stack);
  });


function filePath2moduleName (filePath) {
  return filePath.
  replace(/^\//, '');              // remove / prefix
  //replace(/\.\w+$/, '');           // remove suffix
}

function onlySpecFiles (path) {
  return /\/.+-test\.js$/.test(path);
}

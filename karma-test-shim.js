// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
window.__karma__.loaded = function () {};

System.baseURL = '/base/dest/';
System.packages['http://localhost:9876/base/dest/source/iml'] = {
  format: 'register',
  defaultExtension: 'js',
  map: Object.keys(window.__karma__.files)
    .filter(onlyAppFiles)
    .reduce(function createPathRecords (pathsMapping, appPath) {
      // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
      // './hero.service': '/base/src/app/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
      var moduleName = appPath.replace(/^\/base\/dist\/iml\//, './').replace(/\.js$/, '');
      pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
      return pathsMapping;
    }, {})
};

System.meta = Object.keys(System.meta)
  .reduce(function (obj, key) {
    var testKey = key.replace(/^.+static\/chroma_ui\//, 'http://localhost:9876/base/dest/');

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
    window.__karma__.error(error.stack || error);
  });


function filePath2moduleName (filePath) {
  return filePath.
  replace(/^\//, '');              // remove / prefix
  //replace(/\.\w+$/, '');           // remove suffix
}


function onlyAppFiles (filePath) {
  return /^\/base\/dest\/iml\/.*\.js$/.test(filePath);
}


function onlySpecFiles (path) {
  return /\/.+-test\.js$/.test(path);
}

// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () {};

System.baseURL = 'base';
System.packages['http://localhost:9876/base/source/iml'] = {
  defaultExtension: false,
  //format: 'register',
  map: Object.keys(window.__karma__.files).
  filter(onlyAppFiles).
  reduce(function createPathRecords (pathsMapping, appPath) {
    // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
    // './hero.service': '/base/src/app/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
    var moduleName = appPath.replace(/^\/base\/source\/chroma_ui\/iml\//, './').replace(/\.js$/, '');
    pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
    return pathsMapping;
  }, {})
};
//System.config({
//  packages: {
//    'source/iml': {
//      defaultExtension: false,
//      format: 'register',
//      map: Object.keys(window.__karma__.files).
//      filter(onlyAppFiles).
//      reduce(function createPathRecords(pathsMapping, appPath) {
//        // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
//        // './hero.service': '/base/src/app/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
//        var moduleName = appPath.replace(/^\/base\/source\/chroma_ui\/iml\//, './').replace(/\.js$/, '');
//        pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath]
//        return pathsMapping;
//      }, {})
//    }
//  }
//});

Promise.all(
  Object
    .keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(filePath2moduleName)        // Normalize paths to module names.
    .map(function (moduleName) {
      // loads all spec files via their global module names (e.g. 'base/src/app/hero.service.spec')
      return System.import(moduleName.replace(/^base\//, ''));
    })
  )
  .then(function () {
    __karma__.start();
  }, function (error) {
    __karma__.error(error.stack || error);
  });


function filePath2moduleName(filePath) {
  return filePath.
  replace(/^\//, '');              // remove / prefix
  //replace(/\.\w+$/, '');           // remove suffix
}


function onlyAppFiles (filePath) {
  return /^\/base\/source\/chroma_ui\/iml\/.*\.js$/.test(filePath);
}


function onlySpecFiles (path) {
  return /-test\.js$/.test(path);
}

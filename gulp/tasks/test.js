var Server = require('karma').Server;

function runServer (options) {
  return function runner (done) {
    new Server(Object.assign({
      configFile: process.cwd() + '/karma.conf.js'
    }, options), done)
      .start();
  };
}

module.exports.continuous = runServer({});
module.exports.once = runServer({
  singleRun: true,
  reporters: ['dots']
});
module.exports.ci = runServer({
  singleRun: true,
  reporters: ['dots', 'junit']
});

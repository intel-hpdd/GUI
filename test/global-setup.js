import angular from 'angular';
import 'angular-mocks';

import fixturesModule from './fixtures/fixtures';
import * as fp from '@mfl/fp';

beforeEach(angular.mock.module(fixturesModule));

/**
 * HOF. Allows equal expectation to take on a more
 * fluent interface.
 * @param {*} expected
 * @returns {Function}
 */
window.expectToEqual = function expectToEqualWrap(expected) {
  return function expectToEqual(val) {
    expect(val).toEqual(expected);
  };
};

window.convertNvDates = function convertNvDates(s) {
  return s.tap(
    fp.map(function(item) {
      item.values.forEach(function(value) {
        value.x = value.x.toJSON();
      });
    })
  );
};

window.beforeEachAsync = (runAsync: Function, timeout: number) => {
  timeout = timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(done => {
    runAsync().then(done).catch(done.fail);
  }, timeout);
};

window.itAsync = (desc, runAsync) => {
  it(desc, done => {
    runAsync().then(done).catch(done.fail);
  });
};

const CACHE_INITIAL_DATA = {
  session: {
    read_enabled: true,
    user: {
      groups: [
        { id: '1', name: 'superusers', resource_uri: '/api/group/1/' },
        {
          id: '2',
          name: 'filesystem_administrators',
          resource_uri: '/api/group/1/'
        },
        { id: '3', name: 'filesystem_users', resource_uri: '/api/group/1/' }
      ]
    }
  }
};
const ALLOW_ANONYMOUS_READ = true;
const STATIC_URL = 'gui/';
const location = {
  protocol: 'https',
  hostname: 'localhost'
};

systemMock('source/iml/global.js', {
  default: {
    CACHE_INITIAL_DATA,
    ALLOW_ANONYMOUS_READ,
    STATIC_URL,
    location
  }
});

systemMock('source/iml/socket-worker/get-web-worker.js', {
  default: jasmine.createSpy('getWebWorker').and.returnValue({
    addEventListener: jasmine.createSpy('addEventListener'),
    postMessage: jasmine.createSpy('postMessage')
  })
});

function systemMock(file, mod) {
  let name = file;
  name = System.map[name] || name;
  name = System.normalizeSync(name);

  System.delete(name);
  System.set(name, System.newModule(mod));
}

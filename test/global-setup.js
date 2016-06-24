import angular from 'angular';
import 'angular-mocks';

import fixturesModule from './fixtures/fixtures';
import highland from 'highland';
import {find} from 'intel-lodash-mixins';
import {curry, map, noop} from 'intel-fp';

function cssMatcher (presentClasses, absentClasses) {
  return () => {
    return {
      compare: (el) => {
        if (el.get)
          el = el.get(0);

        if (el.classList.contains(presentClasses) && !el.classList.contains(absentClasses))
          return {
            pass: true,
            message: `Expected '${angular.mock.dump(el)}' to have class '${presentClasses}'
            and not have class ${absentClasses}, but had ${el.className}.`
          };
        else
          return {
            pass: false,
            message: `Expected '${angular.mock.dump(el)}' not to have class '${presentClasses}'
            and to have class ${absentClasses}, but had ${el.className}.`
          };
      }
    };
  };
}

beforeEach(() => {
  jasmine.addMatchers({
    toHaveText () {
      return {
        compare: (el, text) => {
          const elText = el.textContent.trim();

          if (elText === text)
            return {
              pass: true,
              message: `Expected '${elText}' not to be text '${text}'.`
            };
          else
            return {
              pass: false,
              message: `Expected '${elText}' to be text '${text}'.`
            };
        }
      };
    },
    toHaveClass () {
      return {
        compare: (el, clazz) => {
          if (!(el instanceof Element))
            el = el[0];

          if (el.classList.contains(clazz))
            return {
              pass: true,
              message: `Expected '${angular.mock.dump(el)}' not to have class '${clazz}'.`
            };
          else
            return {
              pass: false,
              message: `Expected '${angular.mock.dump(el)}' to have class '${clazz}'.`
            };
        }
      };
    },
    toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
    toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
    toBeShown () {
      return {
        compare (el) {
          if (el && el.get)
            el = el.get(0);

          if (el && !el.classList.contains('ng-hide'))
            return {
              pass: true,
              message: 'Expected element to have \'ng-hide\' class.'
            };
          else
            return {
              pass: false,
              message: 'Expected element not to have \'ng-hide\' class.'
            };
        }
      };
    },
    toBeAPromise () {
      return {
        compare (actual) {
          const isPromiseLike = (obj) => obj && typeof obj.then === 'function';

          if (isPromiseLike(actual))
            return {
              pass: true,
              message: 'Expected object to be a promise'
            };
          else
            return {
              pass: false,
              message: 'Expected object not to be a promise'
            };
        }
      };
    }
  });
});

beforeEach(angular.mock.module(fixturesModule));

window.λ = window.highland;

window.extendWithConstructor = (constructor, obj) => {
  const scope = Object.create({}, {});
  angular.extend(scope, obj);
  Object.getPrototypeOf(scope).constructor = constructor;

  return scope;
};
/**
 * HOF. Allows equal expectation to take on a more
 * fluent interface.
 * @param {*} expected
 * @returns {Function}
 */
window.expectToEqual = function expectToEqualWrap (expected) {
  return function expectToEqual (val) {
    expect(val).toEqual(expected);
  };
};

/**
 * Curried. Checks if a stream contains a collection
 * with the given sub-item.
 * @param {Function | Object | String} value
 * @param {Highland.Stream} s
 */
window.expectStreamToContainItem = curry(2, function expectStreamToContainItem (value, s) {
  return s.each(x => expect(find(x, value)).toBeTruthy());
});

window.convertNvDates = function convertNvDates (s) {
  return s.tap(map(function (item) {
    item.values.forEach(function (value) {
      value.x = value.x.toJSON();
    });
  }));
};

window.patchRateLimit = function patchRateLimit () {
  var proto = Object.getPrototypeOf(highland());
  var oldRateLimit = proto.ratelimit;

  proto.ratelimit = function ratelimit () {
    return this.tap(noop);
  };

  return function revert () {
    proto.ratelimit = oldRateLimit;
  };
};

window.flushD3Transitions = function flushD3Transitions () {
  var now = Date.now;
  Date.now = function () {
    return Infinity;
  };
  window.d3.timer.flush();
  Date.now = now;
};

window.beforeEachAsync = runAsync => {
  beforeEach(done => {
    runAsync()
    .then(done)
    .catch(done.fail);
  });
};

window.itAsync = (desc, runAsync) => {
  it(desc, done => {
    runAsync()
    .then(done)
    .catch(done.fail);
  });
};

window.CACHE_INITIAL_DATA = {
  session: {
    read_enabled: true,
    user: {
      groups: [
        {id: '1', name: 'superusers', resource_uri: '/api/group/1/'},
        {id: '2', name: 'filesystem_administrators', resource_uri: '/api/group/1/'},
        {id: '3', name: 'filesystem_users', resource_uri: '/api/group/1/'}
      ]
    }
  }
};
window.ALLOW_ANONYMOUS_READ = true;

let name = 'source/iml/socket-worker/get-web-worker.js';
name = System.map[name] || name;
name = System.normalizeSync(name);

System.delete(name);
System.set(name, System.newModule({
  default: jasmine
    .createSpy('getWebWorker')
    .and
    .returnValue({
      addEventListener: jasmine.createSpy('addEventListener'),
      postMessage: jasmine.createSpy('postMessage')
    })
}));

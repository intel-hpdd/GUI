import angular from 'angular';
import 'angular-mocks';

import fixturesModule from './fixtures/fixtures';
import {find} from 'intel-lodash-mixins';
import * as fp from 'intel-fp';

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
    toEqualComponent (util, customEqualityTesters) {
      return {
        compare(component, expected) {

          const clean = s => s
            .replace(/^\s+/gm, '')
            .replace(/\n/g, '');

          const cleanComponent = c => {
            if (c && c.template)
              c = {
                ...c,
                template: clean(c.template)
              };

            return c;
          };

          const eq = util.equals(
            cleanComponent(component),
            cleanComponent(expected),
            customEqualityTesters
          );

          const stringy = o => JSON.stringify(o, null, 2);

          if (eq)
            return {
              pass: true,
              message: `expected ${stringy(component)} to equal ${stringy(expected)}`
            };
          else
            return {
              pass: false,
              message: `expected ${stringy(component)} not to equal ${stringy(expected)}`
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
window.expectStreamToContainItem = fp.curry2(function expectStreamToContainItem (value, s) {
  return s.each(x => expect(find(x, value)).toBeTruthy());
});

window.convertNvDates = function convertNvDates (s) {
  return s.tap(fp.map(function (item) {
    item.values.forEach(function (value) {
      value.x = value.x.toJSON();
    });
  }));
};

window.flushD3Transitions = function flushD3Transitions () {
  const now = Date.now;
  Date.now = function () {
    return Infinity;
  };
  window.d3.timer.flush();
  Date.now = now;
};

window.beforeEachAsync = (runAsync:Function, timeout:number) => {
  timeout = timeout || jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(done => {
    runAsync()
    .then(done)
    .catch(done.fail);
  }, timeout);
};

window.itAsync = (desc, runAsync) => {
  it(desc, done => {
    runAsync()
    .then(done)
    .catch(done.fail);
  });
};

const CACHE_INITIAL_DATA = {
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
const ALLOW_ANONYMOUS_READ = true;
const STATIC_URL = 'static/chroma_ui/';
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
  default: jasmine
    .createSpy('getWebWorker')
    .and
    .returnValue({
      addEventListener: jasmine.createSpy('addEventListener'),
      postMessage: jasmine.createSpy('postMessage')
    })
});

function systemMock (file, mod) {
  let name = file;
  name = System.map[name] || name;
  name = System.normalizeSync(name);

  System.delete(name);
  System.set(name, System.newModule(mod));
}

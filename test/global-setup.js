beforeEach(module('fixtures'));

(function () {
  'use strict';

  window.λ = window.highland;

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
  window.expectStreamToContainItem = _.curry(function expectStreamToContainItem (value, s) {
    return s.each(function (x) {
      expect(_.find(x, value)).toBeTruthy();
    });
  });

  window.convertNvDates = function convertNvDates (s) {
    return s.tap(_.fmap(function (item) {
      item.values.forEach(function (value) {
        value.x = value.x.toJSON();
      });
    }));
  };

  window.patchRateLimit = function patchRateLimit () {
    var proto = Object.getPrototypeOf(highland());
    var oldRateLimit = proto.ratelimit;

    proto.ratelimit = function ratelimit () {
      return this.tap(_.noop);
    };

    return function revert () {
      proto.ratelimit = oldRateLimit;
    };
  };

  window.flushD3Transitions = function flushD3Transitions () {
    var now = Date.now;
    Date.now = function() { return Infinity; };
    window.d3.timer.flush();
    Date.now = now;
  };

  // Go around the injector and set this globally for tests.
  window.mock = new window.Mock();
}());

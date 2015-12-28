import angular from 'angular';
const {module, inject} = angular.mock;

import {__, curry, always} from 'intel-fp/fp';

describe('parser sepBy1', function () {
  'use strict';

  beforeEach(module('parserModule'));

  var sepBy1, ifToken;

  beforeEach(inject(function (_sepBy1_) {
    sepBy1 = _sepBy1_;

    ifToken = curry(2, function ifToken (elseFn, t) {
      if (!t.length)
        return new Error('boom!');

      t.shift();

      return elseFn(t);
    });
  }));

  it('should be a function', function () {
    expect(sepBy1).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(sepBy1(__, __)).toEqual(jasmine.any(Function));
  });

  it('should match a symbol', function () {
    expect(sepBy1(
      ifToken(always('bar')),
      ifToken(always(',')),
      [
        {}
      ]
    )).toEqual('bar');
  });

  it('should match a symbol, sep, symbol', function () {
    expect(sepBy1(
      ifToken(always('bar')),
      ifToken(always(',')),
      [
        {},
        {},
        {}
      ]
    )).toEqual('bar,bar');
  });
});

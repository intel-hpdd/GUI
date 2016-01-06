import angular from 'angular';
const {module, inject} = angular.mock;

import {__, curry, identity, always} from 'intel-fp/fp';

describe('many till', function () {
  beforeEach(module('parserModule'));

  var manyTill, consumeToken;

  beforeEach(inject(function (_manyTill_) {
    manyTill = _manyTill_;

    consumeToken = curry(2, function consumeToken (fn, tokens) {
      var token = tokens.shift();

      return fn(token);
    });
  }));

  it('should be a function', function () {
    expect(manyTill).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(manyTill(__, __)).toEqual(jasmine.any(Function));
  });

  describe('token handling', function () {
    var tokens, res;

    beforeEach(function () {
      tokens = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      res = manyTill(consumeToken(identity), consumeToken(function (x) {
        if (x === 2)
          return x;
        else
          return new Error('x is not 2');
      }), tokens);
    });

    it('should consume until the end fn ', function () {
      expect(res).toEqual('109876543');
    });

    it('should rewind if result returns an Error', function () {
      expect(tokens).toEqual([2, 1]);
    });
  });

  describe('error handling', function () {
    var tokens, res;

    beforeEach(function () {
      tokens = [3, 2, 1];
      res = manyTill(consumeToken(function (x) {
        if (x === 3)
          return x;
        else
          return new Error('x is not 3');
      }), always(new Error('boom!')), tokens);
    });

    it('should rewind if output was consumed', function () {
      expect(tokens).toEqual([2, 1]);
    });

    it('should return an Error even if output was consumed', function () {
      expect(res).toEqual(new Error('x is not 3'));
    });
  });
});

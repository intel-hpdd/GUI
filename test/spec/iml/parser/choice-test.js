import angular from 'angular';
const {module, inject} = angular.mock;

import {__, eq, lensProp, curry, head} from 'intel-fp/fp';

describe('parser choice', function () {
  'use strict';

  beforeEach(module('parserModule'));

  var choice;

  beforeEach(inject(function (_choice_) {
    choice = _choice_;
  }));

  it('should return a function', function () {
    expect(choice).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(choice(__)).toEqual(jasmine.any(Function));
  });

  describe('finding choices', function () {
    var chooser, matcher;

    beforeEach(function () {
      var nameLens = lensProp('name');

      matcher = curry(2, function matcher (name, tokens) {
        var token = head(tokens);
        var tokenName = nameLens(token);

        if (eq(name, tokenName))
          return token.content;

        return new Error('boom!');
      });


      chooser = choice([
        matcher('a'),
        matcher('b')
      ]);
    });

    it('should match a', function () {
      expect(chooser([{
        name: 'a',
        content: 'eeey'
      }])).toEqual('eeey');
    });

    it('should match b', function () {
      expect(chooser([{
        name: 'b',
        content: 'beee'
      }])).toEqual('beee');
    });

    it('should return an error', function () {
      expect(chooser([{
        name: 'c',
        content: 'seee'
      }]).message).toEqual('boom!');
    });
  });

  it('should return the most specific error', function () {
    var takeN = curry(2, function takeN (n, tokens) {
      tokens.splice(0, n);

      return new Error('took ' + n + ' tokens');
    });

    var result = choice([
      takeN(2),
      takeN(1)
    ], [
      {},
      {}
    ]);

    expect(result.message).toEqual('took 2 tokens');
  });
});

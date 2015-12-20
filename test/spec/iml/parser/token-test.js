import angular from 'angular';
const {module, inject} = angular.mock;

describe('parser token', function () {
  'use strict';

  beforeEach(module('parserModule'));

  var token, fn;

  beforeEach(inject(function (_token_) {
    token = _token_;

    fn = token('foo', fp.always('bar'));
  }));

  it('should be a function', function () {
    expect(token).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(token(fp.__, fp.__)).toEqual(jasmine.any(Function));
  });

  it('should return an error if there are no tokens', function () {
    expect(fn([]).message).toBe('Expected foo got end of string');
  });

  it('should return the computed output', function () {
    expect(fn([{
      name: 'foo'
    }])).toBe('bar');
  });

  it('should shift consumed tokens off the array', function () {
    var tokens = [
      {
        name: 'foo'
      },
      {
        name: 'baz'
      }
    ];

    fn(tokens);

    expect(tokens).toEqual([
      {
        name: 'baz'
      }
    ]);
  });

  it('should report mismatched tokens', function () {
    expect(fn([
      {
        name: 'baz',
        character: 0
      }
    ]).message).toEqual('Expected foo got baz at character 0');
  });
});

import angular from 'angular';
const {module, inject} = angular.mock;

describe('parser optional', function () {
  'use strict';

  beforeEach(module('parserModule'));

  var optional, spy;

  beforeEach(inject(function (_optional_) {
    optional = _optional_;
    spy = jasmine.createSpy('spy');
  }));

  it('should be a function', function () {
    expect(optional).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(optional(fp.__)).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', function () {
    expect(optional(spy, [])).toEqual('');
  });

  it('should not call the parser if there are no tokens', function () {
    optional(spy, []);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the parser if there is a token', function () {
    optional(spy, [{}]);

    expect(spy).toHaveBeenCalledOnceWith([{}]);
  });

  it('should return the result of the parser', function () {
    spy.andReturn('foo');

    expect(optional(spy, [{}])).toEqual('foo');
  });
});

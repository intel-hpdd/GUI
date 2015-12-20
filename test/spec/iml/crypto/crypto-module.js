import angular from 'angular';
const {module, inject} = angular.mock;

describe('get random value', function () {
  'use strict';

  var getRandomValues;

  beforeEach(module('crypto', function ($provide) {
    getRandomValues = jasmine.createSpy('getRandomValues').andReturn([2]);

    $provide.value('crypto', {
      getRandomValues: getRandomValues
    });
  }));

  var getRandomValue;

  beforeEach(inject(function (_getRandomValue_) {
    getRandomValue = _getRandomValue_;
  }));

  it('should be called with a Uint32Array', function () {
    getRandomValue();

    expect(getRandomValues).toHaveBeenCalledOnceWith(new Uint32Array(1));
  });

  it('should return the result of crypto.getRandomValues', function () {
    expect(getRandomValue()).toBe(2);
  });
});

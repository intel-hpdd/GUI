import angular from 'angular';
const {module, inject} = angular.mock;

describe('build response error', function () {
  'use strict';

  beforeEach(module('socket-module'));

  var buildResponseError;

  beforeEach(inject(function (_buildResponseError_) {
    buildResponseError = _buildResponseError_;
  }));

  it('should keep an existing error', function () {
    var response = {
      error: new Error('boom!')
    };

    expect(buildResponseError(response)).toBe(response.error);
  });

  it('should wrap a string error in an Error', function () {
    var response = {
      error: 'boom!'
    };

    var error = new Error('boom!');

    expect(buildResponseError(response)).toEqual(error);
  });

  it('should convert an object literal to an error instance', function () {
    var response = {
      error: {
        message: 'boom!',
        statusCode: 500
      }
    };

    var error = new Error('boom!');
    error.statusCode = 500;

    expect(buildResponseError(response)).toEqual(error);
  });
});



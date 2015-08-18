angular.module('socket-module').factory('buildResponseError', [function buildResponseErrorFactory () {
  'use strict';

  /**
   * Normalizes anything that is not an Error instance into one.
   * @param {Object} response
   * @returns {Error}
   */
  return function buildResponseError (response) {
    var error;

    if (response.error instanceof Error) {
      error = response.error;
    } else if (_.isPlainObject(response.error)) {
      error = Object.keys(response.error)
        .reduce(function fillOutProperties (error, key) {
          if (key !== 'message')
            error[key] = response.error[key];

          return error;
        }, new Error(response.error.message));
    } else {
      error = new Error(response.error);
    }

    return error;
  };
}]);

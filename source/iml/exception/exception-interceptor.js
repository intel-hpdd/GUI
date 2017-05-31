//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function exceptionInterceptor ($exceptionHandler, $q) {
  'ngInject';

  return {
    requestError: function requestError (rejection) {
      var args = [];

      if (rejection instanceof Error) {
        args.unshift(rejection);
      } else if (typeof rejection === 'string') {
        args.unshift(null, rejection);
      } else {
        var error = new Error('Request Error');

        error.rejection = rejection;

        args.unshift(error);
      }

      $exceptionHandler.apply($exceptionHandler, args);
    },
    responseError: function responseError (response) {
      var rejected = $q.reject(response);

      //400s and 403s do not trigger the modal. It is the responsibility of the base model to handle them.
      if (response.status === 400 || response.status === 403) return rejected;

      var error = new Error('Response Error!');

      // Add the response to the error instance.
      error.response = {
        data: response.data,
        status: response.status,
        headers: response.headers(),
        config: response.config
      };

      $exceptionHandler(error);

      return rejected;
    }
  };
}

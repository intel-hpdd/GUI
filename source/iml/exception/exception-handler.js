//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default ($provide) => {
  'ngInject';

  $provide.decorator('$exceptionHandler', function ($injector, windowUnload, $delegate) {
    'ngInject';

    var triggered;
    var cache = {};

    return function handleException (exception, cause) {
      //Always hit the delegate.
      $delegate(exception, cause);

      if (triggered || windowUnload.unloading) return;

      triggered = true;

      // Lazy Load to avoid a $rootScope circular dependency.
      var exceptionModal = get('exceptionModal'),
        $document = get('$document');

      exception.cause = cause;
      exception.url = $document[0].URL;

      exceptionModal({
        resolve: {
          exception: function () {
            return exception;
          }
        }
      });
    };

    function get (serviceName) {
      return cache[serviceName] || (cache[serviceName] = $injector.get(serviceName));
    }
  });
};

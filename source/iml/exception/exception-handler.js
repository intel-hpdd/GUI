//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

const regex = /^.+\:\d+\:\d+.*$/;

export default $provide => {
  'ngInject';
  $provide.decorator('$exceptionHandler', function(
    $injector,
    windowUnload,
    $delegate
  ) {
    'ngInject';
    let triggered;
    const cache = {};

    return function handleException(exception, cause) {
      //Always hit the delegate.
      $delegate(exception, cause);

      if (triggered || windowUnload.unloading) return;

      triggered = true;

      if (!exception.statusCode && stackTraceContainsLineNumbers(exception))
        sendStackTraceToSrcmapReverseService(exception);

      // Lazy Load to avoid a $rootScope circular dependency.
      const exceptionModal = get('exceptionModal');
      const $document = get('$document');

      exception.cause = cause;
      exception.url = $document[0].URL;

      exceptionModal({
        resolve: {
          exception: function() {
            return exception;
          }
        }
      });
    };

    function get(serviceName) {
      return (
        cache[serviceName] || (cache[serviceName] = $injector.get(serviceName))
      );
    }
  });
};

function stackTraceContainsLineNumbers(stackTrace) {
  return stackTrace.stack
    .split('\n')
    .some(function verifyStackTraceContainsLineNumbers(val) {
      const match = val.trim().match(regex);
      return match == null ? false : match.length > 0;
    });
}

function sendStackTraceToSrcmapReverseService(exception) {
  fetch('/iml-srcmap-reverse', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      trace: exception.stack
    })
  });
}

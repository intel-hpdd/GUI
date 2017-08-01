//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';
import highland from 'highland';

export function ExceptionModalCtrl(
  $scope,
  $document,
  exception,
  stackTraceContainsLineNumber,
  sendStackTraceToSrcmapReverseService
) {
  'ngInject';
  $scope.exceptionModal = {
    messages: [],
    reload: function reload() {
      $document[0].location.reload(true);
    }
  };

  if (!exception.statusCode && stackTraceContainsLineNumber(exception)) {
    $scope.exceptionModal.loadingStack = true;
    sendStackTraceToSrcmapReverseService(exception).each(function updateData(
      newException
    ) {
      $scope.exceptionModal.loadingStack = false;
      _.find($scope.exceptionModal.messages, {
        name: 'Client Stack Trace'
      }).value =
        newException.stack;

      $scope.$digest();
    });
  }

  /**
   * Stringify's a value
   * @param {*} value
   * @returns {String}
   */
  const stringify = lookupAnd(function stringify(value) {
    return JSON.stringify(value, null, 2);
  });

  /**
   * Multi line trim
   * @param {String} value
   * @returns {String}
   */
  const multiLineTrim = lookupAnd(function multiLineTrim(value) {
    return value
      .split('\n')
      .map(function(line) {
        return line.trim();
      })
      .join('\n');
  });

  const addSection = _.partial(
    buildMessage,
    $scope.exceptionModal.messages,
    exception
  );

  addSection('name');
  addSection('message');
  addSection('statusCode', { name: 'Status Code' });
  addSection('stack', { name: 'Client Stack Trace', transform: multiLineTrim });
  addSection('cause');
  addSection('response.status', { name: 'Response Status' });
  addSection('response.data.error_message', { name: 'Error Message' });
  addSection('response.data.traceback', {
    name: 'Server Stack Trace',
    transform: multiLineTrim
  });
  addSection('response.headers', {
    name: 'Response Headers',
    transform: stringify
  });
  addSection('response.config.method');
  addSection('response.config.url');
  addSection('response.config.headers', {
    name: 'Request Headers',
    transform: stringify
  });
  addSection('response.config.data', { transform: stringify });

  function buildMessage(arr, err, path, opts) {
    opts = _.clone(opts || {});
    _.defaults(opts, {
      transform: _.identity,
      name: path.split('.').pop()
    });

    const item = _.pluckPath(path, err);

    if (!item) return;

    arr.push({
      name: opts.name,
      value: opts.transform(item)
    });
  }

  function lookupAnd(func) {
    return function(value) {
      if (!value) return false;

      try {
        return func(value);
      } catch (e) {
        return String(value).valueOf();
      }
    };
  }
}

const regex = /^.+\:\d+\:\d+.*$/;

export function stackTraceContainsLineNumbers(stackTrace) {
  return stackTrace.stack
    .split('\n')
    .some(function verifyStackTraceContainsLineNumbers(val) {
      const match = val.trim().match(regex);
      return match == null ? false : match.length > 0;
    });
}

export function sendStackTraceToSrcmapReverseService(exception) {
  return highland(
    fetch('/iml-srcmap-reverse', {
      method: 'POST',
      headers: {
        Connection: 'close',
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Transfer-Encoding': 'chunked'
      },
      body: JSON.stringify({
        trace: exception.stack
      })
    })
  )
    .flatMap(response => highland(response.json()))
    .map(stack => {
      if (stack) exception.stack = stack;

      return exception;
    });
}

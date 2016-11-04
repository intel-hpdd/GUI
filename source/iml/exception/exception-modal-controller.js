//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import _ from 'intel-lodash-mixins';
import socketStream from '../socket/socket-stream.js';

export function ExceptionModalCtrl ($scope, $document, exception,
                                    stackTraceContainsLineNumber, sendStackTraceToRealTime) {
  'ngInject';

  $scope.exceptionModal = {
    messages: [],
    reload: function reload () {
      $document[0].location.reload(true);
    }
  };

  if (!exception.statusCode && stackTraceContainsLineNumber(exception)) {
    $scope.exceptionModal.loadingStack = true;
    sendStackTraceToRealTime(exception)
      .each(function updateData (newException) {
        $scope.exceptionModal.loadingStack = false;
        _.find($scope.exceptionModal.messages, { name: 'Client Stack Trace' }).value = newException.stack;

        $scope.$digest();
      });
  }

  /**
   * Stringify's a value
   * @param {*} value
   * @returns {String}
   */
  const stringify = lookupAnd(function stringify (value) {
    return JSON.stringify(value, null, 2);
  });

  /**
   * Multi line trim
   * @param {String} value
   * @returns {String}
   */
  const multiLineTrim = lookupAnd(function multiLineTrim (value) {
    return value.split('\n')
      .map(function (line) {
        return line.trim();
      }).join('\n');
  });

  const addSection = _.partial(buildMessage, $scope.exceptionModal.messages, exception);

  addSection('name');
  addSection('message');
  addSection('statusCode', { name: 'Status Code' });
  addSection('stack', { name: 'Client Stack Trace', transform: multiLineTrim });
  addSection('cause');
  addSection('response.status', { name: 'Response Status' });
  addSection('response.data.error_message', { name: 'Error Message' });
  addSection('response.data.traceback', { name: 'Server Stack Trace', transform: multiLineTrim });
  addSection('response.headers', { name: 'Response Headers', transform: stringify });
  addSection('response.config.method');
  addSection('response.config.url');
  addSection('response.config.headers', { name: 'Request Headers', transform: stringify });
  addSection('response.config.data', { transform: stringify });

  function buildMessage (arr, err, path, opts) {
    opts = _.clone(opts || {});
    _.defaults(opts, {
      transform: _.identity,
      name: path.split('.').pop()
    });

    const item = _.pluckPath(path, err);

    if (!item)
      return;

    arr.push({
      name: opts.name,
      value: opts.transform(item)
    });
  }

  function lookupAnd (func) {
    return function (value) {
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

export function stackTraceContainsLineNumbers (stackTrace) {
  return stackTrace.stack.split('\n')
    .some(function verifyStackTraceContainsLineNumbers (val) {
      const match = val.trim().match(regex);
      return (match == null) ? false : match.length > 0;
    });
}

export function sendStackTraceToRealTime (exception) {
  return socketStream('/srcmap-reverse', {
    method: 'post',
    cause: exception.cause,
    message: exception.message,
    stack: exception.stack,
    url: exception.url
  }, true)
    .map(function processResponse (x) {
      if (x && x.data)
        exception.stack = x.data;

      return exception;
    });
}

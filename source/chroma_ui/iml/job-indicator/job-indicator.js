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

import angular from 'angular';

import * as fp from 'intel-fp/fp';

angular.module('jobIndicator')
  .factory('jobMonitor',
    function jobMonitorFactory (socketStream) {
      'ngInject';

      return function jobMonitor () {
        var stream = socketStream('/job/', {
          jsonMask: 'objects(write_locks,read_locks,description)',
          qs: {
            limit: 0,
            state__in: ['pending', 'tasked']
          }
        });

        var s2 = stream
          .pluck('objects');

        s2.destroy = stream.destroy.bind(stream);

        return s2;
      };
    }
  )
  .directive('jobStatus', function jobStatusDirective (localApply) {
    'ngInject';

    return {
      scope: {
        recordId: '=',
        jobStream: '='
      },
      restrict: 'E',
      templateUrl: 'iml/job-indicator/assets/html/job-indicator.html',

      link: function link (scope) {
        var isOpened = false;

        angular.extend(scope, {
          closeOthers: false,
          openWrite: true,
          openRead: true,
          readMessages: [],
          readMessageDifference: [],
          writeMessages: [],
          writeMessageDifference: [],
          onToggle: function onToggle (state) {
            if (state === 'closed') {
              scope.clearMessageRecords();
              isOpened = false;
            } else if (state === 'opened') {
              isOpened = true;
            }
          },
          clearMessageRecords: function clearMessageRecords () {
            scope.readMessageDifference.length = 0;
            scope.writeMessageDifference.length = 0;
          },
          shouldShowLockIcon: function shouldShowLockIcon () {
            return (scope.writeMessages.length + scope.readMessages.length) > 0 || isOpened;
          },
          getLockTooltipMessage: function getLockTooltipMessage () {
            var readMessages = scope.readMessages;
            var writeMessages = scope.writeMessages;
            var message = '';
            var writeMessageMap, readMessageMap;

            if (writeMessages.length > 0 && readMessages.length > 0) {
              writeMessageMap = {
                '1': 'There is 1 ongoing write lock operation and ',
                'other': 'There are {} ongoing write lock operations and '
              };
              var writeMessage = _.pluralize(writeMessages.length, writeMessageMap);

              readMessageMap = {
                '1': '1 pending read lock operation.',
                'other': '{} pending read lock operations.'
              };
              var readMessage = _.pluralize(readMessages.length, readMessageMap);

              message = writeMessage + readMessage + ' Click to review details.';

            } else if (writeMessages.length > 0) {
              writeMessageMap = {
                '1': '1 ongoing write lock operation.',
                'other': '{} ongoing write lock operations.'
              };
              message = _.pluralize(writeMessages.length, writeMessageMap) + ' Click to review details.';
            } else if (readMessages.length > 0) {
              readMessageMap = {
                '1': 'Locked by 1 pending operation.',
                'other': 'Locked by {} pending operations.'
              };
              message = _.pluralize(readMessages.length, readMessageMap) + ' Click to review details.';
            }

            return message;
          }
        });

        var mapLockedItemUri = fp.map(fp.lensProp('locked_item_uri'));
        var mapDescription = fp.map(fp.lensProp('description'));

        var calculateLocks = fp.curry(2, function calculateLocks (type, s) {
          var locksLens = fp.lensProp(type + '_locks');
          var messagesLens = fp.lensProp(type + 'Messages');
          var messageDifference = fp.lensProp(type + 'MessageDifference');

          var hasMatchingRecord = fp.flow(
            locksLens,
            mapLockedItemUri,
            fp.some(fp.eq(scope.recordId))
          );
          var findMatchingRecords = fp.filter(hasMatchingRecord);

          var xForm = fp.flow(
            findMatchingRecords,
            mapDescription,
            function setX (x) {
              //this is in a closure because we want to access messages at call time not define time.
              messageDifference
                .set(fp.difference(messagesLens(scope), x), scope);

              return x;
            },
            messagesLens.set(fp.__, scope)
          );

          fp.map(xForm, s)
            .each(localApply.bind(null, scope));
        });

        var readStream = scope.jobStream.property();
        var writeStream = scope.jobStream.property();

        readStream.through(calculateLocks('read'));
        writeStream.through(calculateLocks('write'));

        scope.$on('$destroy', function onDestroy () {
          readStream.destroy();
          writeStream.destroy();
          readStream = writeStream = null;
        });
      }
    };
  });

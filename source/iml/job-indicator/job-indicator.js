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
import _ from 'intel-lodash-mixins';
import * as fp from 'intel-fp';
import jobIndicatorTemplate from './assets/html/job-indicator.html!text';

const viewLens = fp.flow(fp.lensProp, fp.view);

export default function jobStatusDirective (localApply) {
  'ngInject';

  return {
    scope: {
      recordId: '=',
      jobStream: '='
    },
    restrict: 'E',
    template: jobIndicatorTemplate,

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


      var mapLockedItemUri = fp.map(viewLens('locked_item_uri'));
      var mapDescription = fp.map(viewLens('description'));

      var calculateLocks = fp.curry2(function calculateLocks (type, s) {
        var hasMatchingRecord = fp.flow(
          viewLens(type + '_locks'),
          mapLockedItemUri,
          fp.some(fp.eq(scope.recordId))
        );
        var findMatchingRecords = fp.filter(hasMatchingRecord);

        var xForm = fp.flow(
          findMatchingRecords,
          mapDescription,
          x => {
            //this is in a closure because we want to access messages at call time not define time.
            scope[type + 'MessageDifference'] = fp.difference(scope[type + 'Messages'], x);

            return x;
          },
          x => scope[type + 'Messages'] = x
        );

        fp.map(xForm, s)
          .each(localApply.bind(null, scope));
      });

      var readViewer = scope.jobStream();
      var writeViewer = scope.jobStream();

      readViewer.through(calculateLocks('read'));
      writeViewer.through(calculateLocks('write'));

      scope.$on('$destroy', function onDestroy () {
        readViewer.destroy();
        writeViewer.destroy();
        readViewer = writeViewer = null;
      });
    }
  };
}

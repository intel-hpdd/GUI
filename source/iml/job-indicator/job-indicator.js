//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import _ from 'intel-lodash-mixins';
import * as fp from 'intel-fp';
import jobIndicatorTemplate from './assets/html/job-indicator.html!text';

const viewLens = fp.flow(fp.lensProp, fp.view);

export default function jobStatusDirective(localApply) {
  'ngInject';
  return {
    scope: {
      recordId: '=',
      jobStream: '='
    },
    restrict: 'E',
    template: jobIndicatorTemplate,

    link: function link(scope) {
      let isOpened = false;

      angular.extend(scope, {
        closeOthers: false,
        openWrite: true,
        openRead: true,
        readMessages: [],
        readMessageDifference: [],
        writeMessages: [],
        writeMessageDifference: [],
        onToggle: function onToggle(state) {
          if (state === 'closed') {
            scope.clearMessageRecords();
            isOpened = false;
          } else if (state === 'opened') {
            isOpened = true;
          }
        },
        clearMessageRecords: function clearMessageRecords() {
          scope.readMessageDifference.length = 0;
          scope.writeMessageDifference.length = 0;
        },
        shouldShowLockIcon: function shouldShowLockIcon() {
          return scope.writeMessages.length + scope.readMessages.length > 0 ||
            isOpened;
        },
        getLockTooltipMessage: function getLockTooltipMessage() {
          const readMessages = scope.readMessages;
          const writeMessages = scope.writeMessages;
          let message = '';
          let writeMessageMap, readMessageMap;

          if (writeMessages.length > 0 && readMessages.length > 0) {
            writeMessageMap = {
              '1': 'There is 1 ongoing write lock operation and ',
              other: 'There are {} ongoing write lock operations and '
            };
            const writeMessage = _.pluralize(
              writeMessages.length,
              writeMessageMap
            );

            readMessageMap = {
              '1': '1 pending read lock operation.',
              other: '{} pending read lock operations.'
            };
            const readMessage = _.pluralize(
              readMessages.length,
              readMessageMap
            );

            message = writeMessage + readMessage + ' Click to review details.';
          } else if (writeMessages.length > 0) {
            writeMessageMap = {
              '1': '1 ongoing write lock operation.',
              other: '{} ongoing write lock operations.'
            };
            message = _.pluralize(writeMessages.length, writeMessageMap) +
              ' Click to review details.';
          } else if (readMessages.length > 0) {
            readMessageMap = {
              '1': 'Locked by 1 pending operation.',
              other: 'Locked by {} pending operations.'
            };
            message = _.pluralize(readMessages.length, readMessageMap) +
              ' Click to review details.';
          }

          return message;
        }
      });

      const mapLockedItemUri = fp.map(viewLens('locked_item_uri'));
      const mapDescription = fp.map(viewLens('description'));

      const calculateLocks = fp.curry2(function calculateLocks(type, s) {
        const hasMatchingRecord = fp.flow(
          viewLens(type + '_locks'),
          mapLockedItemUri,
          fp.some(fp.eq(scope.recordId))
        );
        const findMatchingRecords = fp.filter(hasMatchingRecord);

        const xForm = fp.flow(
          findMatchingRecords,
          mapDescription,
          x => {
            //this is in a closure because we want to access messages at call time not define time.
            scope[type + 'MessageDifference'] = fp.difference(
              scope[type + 'Messages'],
              x
            );

            return x;
          },
          x => scope[type + 'Messages'] = x
        );

        fp.map(xForm, s).each(localApply.bind(null, scope));
      });

      let readViewer = scope.jobStream();
      let writeViewer = scope.jobStream();

      readViewer.through(calculateLocks('read'));
      writeViewer.through(calculateLocks('write'));

      scope.$on('$destroy', function onDestroy() {
        readViewer.destroy();
        writeViewer.destroy();
        readViewer = (writeViewer = null);
      });
    }
  };
}

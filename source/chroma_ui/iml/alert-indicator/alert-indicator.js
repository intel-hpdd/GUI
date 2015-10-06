//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2015 Intel Corporation All Rights Reserved.
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

  angular.module('alertIndicator')
    .factory('alertMonitor',
      function alertMonitorFactory (socketStream) {
        return function alertMonitor () {
          var stream = socketStream('/alert/', {
            jsonMask: 'objects(affected,message)',
            qs: {
              limit: 0,
              active: true
            }
          });

          var s2 = stream
            .pluck('objects');

          s2.destroy = stream.destroy.bind(stream);

          return s2;
        };
      })
    .directive('recordState', function recordState (STATE_SIZE, $exceptionHandler, localApply) {
      return {
        scope: {
          recordId: '=',
          displayType: '=',
          alertStream: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: 'iml/alert-indicator/assets/html/alert-indicator.html',
        link: function link (scope) {
          var isOpen = false;

          var recordState = scope.recordState = {
            alerts: [],
            messageDifference: [],
            onToggle: function onToggle (state) {
              if (state === 'closed') {
                scope.recordState.clearMessageRecord();
                isOpen = false;
              } else {
                isOpen = true;
              }
            },
            isOpen: function isPopoverOpen () {
              return isOpen;
            },
            /**
             * Indicates if the command contains alerts (the directive is in an alert state).
             * @returns {Boolean}
             */
            isInErrorState: function isInErrorState () {
              return recordState.alerts.length > 0;
            },
            /**
             * Clears the message record and difference arrays.
             */
            clearMessageRecord: function clearMessageRecord () {
              scope.recordState.messageDifference = [];
              scope.recordState.messageRecord = [];
            },
            /**
             * Retrieves the tool tip message based on the number of alerts.
             * @returns {String}
             */
            getTooltipMessage: function getTooltipMessage () {
              var messageMap = {
                '0': 'No alerts.',
                '1': '1 alert message. Click to review details.',
                'other': '{} alert messages. Click to review details.'
              };

              return _.pluralize(recordState.alerts.length, messageMap);
            },
            showLabel: function showLabel () {
              return scope.displayType === STATE_SIZE.MEDIUM;
            }
          };

          var propertyStream = scope.alertStream.property();

          var indexOfRecord = fp.invokeMethod('indexOf', [ scope.recordId ]);
          var recordFound = fp.flow(fp.eqFn(fp.identity, indexOfRecord, -1), fp.not);

          propertyStream
            .map(fp.filter(fp.flow(fp.lensProp('affected'), recordFound)))
            .map(fp.map(fp.lensProp('message')))
            .stopOnError(fp.curry(1, $exceptionHandler))
            .tap(function setAlerts (alerts) {
              recordState.messageDifference = fp.difference(recordState.alerts, alerts);
            })
            .tap(fp.lensProp('alerts').set(fp.__, recordState))
            .each(localApply.bind(null, scope));

          scope.$on('$destroy', function onDestroy () {
            propertyStream.destroy();

            recordState = propertyStream = null;
          });
        }
      };
    });



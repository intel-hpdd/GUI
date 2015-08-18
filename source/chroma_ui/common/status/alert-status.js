//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

(function () {
  'use strict';

  angular.module('status')
  /**
   * Alert monitor sets up a stream and sends a get request to the /alert API.
   * Include this service in a controller and make
   * sure to call the end method when the controller is destroyed:
   * $scope.$on('$destroy', function onDestroy () {
   *   alertStream.end();
   * });
   *  @param {Array} The alert monitor dependencies and function
   */
    .factory('alertMonitor', ['socketStream',

      /**
       * Returns a function that returns a stream, which listens on the /alert API.
       * @param {Function} socketStream
       * @returns {Function}
       */
      function alertMonitorFactory (socketStream) {
        /**
         * The alert monitor.
         * @return {Highland.Stream}
         */
        return function alertMonitor () {
          var stream = socketStream('/alert/', {
            jsonMask: 'objects(alert_item,message)',
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
      }])
  /**
   * Record state directive. This directive will show a lock icon if there is an alert for the specified record id.
   * When rolling over the icon a tooltip will appear indicating how many alerts there are in total. Additionally,
   * if you click the state icon, it will display a popover with a list of alerts.
   * As the number of alerts is reduced, they are crossed out. You can close the popover
   * by clicking anywhere outside its region.
   */
    .directive('recordState', ['STATE_SIZE', function recordState (STATE_SIZE) {

      // recordId contains a resource uri which maps to the write_locks[0]locked_item_uri
      return {
        scope: {
          recordId: '=',
          displayType: '=',
          alertStream: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: 'common/status/assets/html/record-state.html',
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

          var filterMatches = _.ffilter(_.compose(_.fisEqual(scope.recordId), _.property('alert_item')));

          propertyStream
            .map(filterMatches)
            .map(_.fmap(_.property('message')))
            .each(function setAlerts (alerts) {
              recordState.messageDifference = _.difference(recordState.alerts, alerts);
              recordState.alerts = alerts;
            });

          scope.$on('$destroy', function onDestroy () {
            propertyStream.destroy();

            recordState = propertyStream = null;
          });
        }
      };
    }]);
})();



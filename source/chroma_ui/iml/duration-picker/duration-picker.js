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

  var DURATIONS = {
    MINUTES: 'minutes',
    HOURS: 'hours',
    DAYS: 'days',
    WEEKS: 'weeks'
  };

  Object.freeze(DURATIONS);

  angular.module('durationPicker')
    .constant('DURATIONS', DURATIONS)
    .directive('durationPicker', ['DURATIONS', 'getServerMoment', durationPicker]);

  function durationPicker (DURATIONS, getServerMoment) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'iml/duration-picker/assets/html/duration-picker.html',
      scope: {
        startUnit: '@',
        startSize: '@'
      },
      controller: ['$scope', function controller ($scope) {
        $scope.duration = {
          type: 'duration',
          unit: $scope.startUnit || DURATIONS.MINUTES,
          size: parseInt($scope.startSize, 10) || 1,
          units: [
            { unit: DURATIONS.MINUTES, count: 60 },
            { unit: DURATIONS.HOURS, count: 24 },
            { unit: DURATIONS.DAYS, count: 31 },
            { unit: DURATIONS.WEEKS, count: 4 }
          ],
          /**
           * Gets the associated count for a unit.
           * @param {string} unit
           * @returns {number|undefined} The count or undefined if a match was not found.
           */
          getCount: function getCount (unit) {
            var item = this.units.filter(function (item) {
              return item.unit === unit;
            }).pop();

            if (item) return item.count;
          },
          /**
           * Sets the unit to the passed in value. Also resets size to 1;
           * @param {string} unit
           */
          setUnit: function setUnit (unit) {
            this.unit = unit;
            this.size = 1;
          }
        };

        $scope.duration.startDate = getServerMoment()
          .subtract(10, 'minutes')
          .seconds(0)
          .milliseconds(0)
          .toDate();
        $scope.duration.endDate = getServerMoment()
          .seconds(0)
          .milliseconds(0)
          .toDate();

        $scope.duration.currentUnit = $scope.duration.unit;
        $scope.duration.currentSize = $scope.duration.size;
      }]
    };
  }
}());


// @flow

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

export const DURATIONS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years'
};

export default {
  scope: {},
  template: `<div class="picker">
  <div class="btn-group btn-group-justified" role="group">
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-primary" ng-model="$ctrl.type" uib-btn-radio="'duration'">Set Duration</button>
    </div>
    <div class="btn-group" role="group">
      <button type="button" class="btn btn-primary" ng-model="$ctrl.type" uib-btn-radio="'range'">Set Range</button>
    </div>
  </div>
  <div ng-if="$ctrl.type === 'duration'" class="duration-controls">
    <ng-form name="durationForm" novalidate>
      <div class="form-group" ng-class="{'has-error': durationForm.size.$invalid, 'has-success': durationForm.size.$valid}">
        <div class="input-group">
          <input class="form-control duration-size" type="number" ng-model="$ctrl.size" name="size" min="1" max="{{ $ctrl.getCount($ctrl.unit) }}" required />
          <iml-tooltip class="error-tooltip" toggle="durationForm.size.$invalid" direction="bottom">
            <span ng-if="durationForm.size.$error.max || durationForm.size.$error.min">
              Duration must be between 1 and {{ $ctrl.getCount($ctrl.unit) }} {{$ctrl.unit}}.
            </span>
            <span ng-if="durationForm.size.$error.required">
              Duration is required.
            </span>
          </iml-tooltip>
          <div class="input-group-btn dropdown" uib-dropdown>
            <button type="button" class="btn btn-default dropdown-toggle" uib-dropdown-toggle>
              {{$ctrl.unit | capitalize}} <span class="caret"></span>
            </button>
            <input type="hidden" ng-model="$ctrl.unit" name="unit" />
            <ul class="dropdown-menu pull-right" role="menu">
              <li ng-repeat="item in $ctrl.units | filter: {unit: '!' + $ctrl.unit}">
                <a ng-click="$ctrl.setUnit(item.unit)">{{ ::item.unit | capitalize }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ng-form>
  </div>
  <div ng-if="$ctrl.type === 'range'" class="range-controls">
    <ng-form name="rangeForm" novalidate>
      <div class="form-group" ng-class="{'has-error': rangeForm.start.$invalid, 'has-success': rangeForm.start.$valid}">
        <label class="sr-only">Start</label>
        <div class="input-group">
          <div class="input-group-addon">Start</div>
          <input class="form-control" type="datetime-local" name="start" ng-model="$ctrl.startDate"
                 placeholder="yyyy-MM-ddTHH:mm" required />
          <iml-tooltip class="error-tooltip" toggle="rangeForm.start.$error.required" direction="bottom">
            Start is required.
          </iml-tooltip>
        </div>
      </div>
      <div class="form-group" ng-class="{'has-error': rangeForm.end.$invalid, 'has-success': rangeForm.end.$valid}">
        <label class="sr-only">End</label>
        <div class="input-group">
          <div class="input-group-addon">End</div>
          <input class="form-control" type="datetime-local" name="end" ng-model="$ctrl.endDate"
                 placeholder="yyyy-MM-ddTHH:mm" required />
          <iml-tooltip class="error-tooltip" toggle="rangeForm.end.$error.required" direction="bottom">
            End is required.
          </iml-tooltip>
        </div>
      </div>
    </ng-form>
  </div>
</div>`,
  bindings: {
    type: '<',
    size: '<',
    unit: '<',
    startDate: '<',
    endDate: '<'
  },
  controller() {
    'ngInject';
    Object.assign(this, {
      units: [
        { unit: DURATIONS.MINUTES, count: 60 },
        { unit: DURATIONS.HOURS, count: 24 },
        { unit: DURATIONS.DAYS, count: 31 },
        { unit: DURATIONS.WEEKS, count: 4 },
        { unit: DURATIONS.MONTHS, count: 12 },
        { unit: DURATIONS.YEARS, count: 5 }
      ],
      getCount(unit) {
        const item = this.units.filter(item => item.unit === unit).pop();

        if (item) return item.count;
      },
      setUnit(unit) {
        this.unit = unit;
        this.size = 1;
      }
    });
  }
};

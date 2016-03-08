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
import * as fp from 'intel-fp';

const viewLens = fp.flow(fp.lensProp, fp.view);

// $FlowIgnore: HTML templates that flow does not recognize.
import alertIndicatorTemplate from './assets/html/alert-indicator';

export function alertMonitorFactory (socketStream) {
  'ngInject';

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
}

export function RecordStateCtrl ($scope, STATE_SIZE, propagateChange) {
  'ngInject';

  const ctrl = angular.extend(this, {
    alerts: [],
    hasAlerts () {
      return ctrl.alerts.length > 0;
    },
    showLabel: function showLabel () {
      return ctrl.displayType === STATE_SIZE.MEDIUM;
    }
  });

  const propertyStream = ctrl.alertStream.property();
  const indexOfRecord = fp.invokeMethod('indexOf', [ctrl.recordId]);
  const recordFound = fp.flow(fp.eqFn(fp.identity, indexOfRecord, -1), fp.not);

  const p = propagateChange($scope, ctrl, 'alerts');

  propertyStream
    .map(fp.filter(fp.flow(viewLens('affected'), recordFound)))
    .map(fp.map(viewLens('message')))
    .through(p);

  $scope.$on('$destroy', propertyStream.destroy.bind(propertyStream));
}

export const recordStateDirective = () => {
  'ngInject';

  return {
    scope: {},
    bindToController: {
      recordId: '=',
      displayType: '=',
      alertStream: '='
    },
    controller: 'RecordStateCtrl',
    controllerAs: 'ctrl',
    restrict: 'E',
    templateUrl: alertIndicatorTemplate
  };
};
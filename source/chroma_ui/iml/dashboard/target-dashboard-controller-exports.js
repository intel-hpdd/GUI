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
import {map, invokeMethod, lensProp, __} from 'intel-fp/fp';

export default function TargetDashboardController ($scope, kind, charts, targetStream, usageStream) {
  'ngInject';

  var targetDashboard = angular.extend(this, {
    charts: charts,
    usageStream: usageStream,
    kind: kind
  });

  var targetLens = lensProp('target');

  targetStream
    .tap(targetLens.set(__, targetDashboard))
    .each($scope.localApply.bind(null, $scope));

  $scope.$on('$destroy', () => {
    targetStream.destroy();
    usageStream.destroy();
    map(invokeMethod('destroy', []), charts);
  });
}
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

import * as fp from 'intel-fp';

import {
  addCurrentPage
} from '../api-transforms.js';

export default function StatusController ($scope, $location, notificationStream) {
  'ngInject';

  const s = notificationStream
    .map(addCurrentPage)
    .tap(x => this.meta = x.meta)
    .pluck('objects');

  $scope.propagateChange($scope, this, 'data', s);

  $scope.$on('$destroy', notificationStream.destroy.bind(notificationStream));

  var types = [
    'CommandErroredAlert',
    'CommandSuccessfulAlert',
    'CommandRunningAlert',
    'CommandCancelledAlert'
  ];
  var getType = fp.flow(
    fp.view(fp.lensProp('record_type')),
    fp.lensProp,
    fp.view
  );
  this.isCommand = fp.flow(getType, fp.invoke(fp.__, [fp.zipObject(types, types)]));

  var ctrl = this;
  this.pageChanged = function pageChanged () {
    $location.search('offset', (ctrl.meta.current_page - 1) * ctrl.meta.limit);
  };
}

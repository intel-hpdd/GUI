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
import highland from 'highland';

import {invokeMethod} from 'intel-fp';

export default function HsmFsCtrl ($scope, $routeSegment, $location,
                                   routeStream, fsStream) {
  'ngInject';

  var fsStream2;

  const hsmFs = angular.extend(this, {
    onUpdate () {
      const fsId = hsmFs.selectedFs ? hsmFs.selectedFs.id : '';
      const path = $routeSegment.getSegmentUrl('app.hsmFs.hsm', {
        fsId
      });
      $location.path(path);
    }
  });

  var p = $scope.propagateChange($scope, hsmFs);

  p('fileSystems', fsStream);

  const rs = routeStream();

  rs
    .filter(invokeMethod('contains', ['hsmFs']))
    .tap(() => {
      if (fsStream2) {
        fsStream2.destroy();
        hsmFs.fs = fsStream2 = null;
      }
    })
    .each(({params: {fsId}}) => {
      if (fsId) {
        fsStream2 = fsStream.property();
        p('fs', fsStream2.flatMap(highland.findWhere({ id: fsId })));
      }
    });

  $scope.$on('$destroy', function onDestroy () {
    rs.destroy();
    fsStream.destroy();
  });
}

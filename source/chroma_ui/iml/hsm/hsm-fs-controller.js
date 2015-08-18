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

angular.module('hsm')
  .controller('HsmFsCtrl', function HsmFsCtrl ($scope, $routeSegment, $location, fsStream, copytoolStream) {
    var fsStream2;

    var hsmFs = obj.merge(this, {
      onUpdate: function onUpdate () {
        var id = hsmFs.selectedFs ? hsmFs.selectedFs.id : '';
        var path = $routeSegment.getSegmentUrl('app.hsmFs.hsm', {
          fsId: id
        });

        hsmFs.setConfigure(false);
        $location.path(path);
      }
    });

    hsmFs.setConfigure = fp.lensProp('configure').set(fp.__, hsmFs);

    var p = $scope.propagateChange($scope, hsmFs);

    p('fileSystems', fsStream);
    p('copytools', copytoolStream.pluck('objects'));

    var remove = $scope.$root.$on('$routeChangeSuccess', onRouteChangeSuccess);

    onRouteChangeSuccess(null, {
      params: $routeSegment.$routeParams
    });

    function onRouteChangeSuccess (ev, args) {
    if (args.redirectTo || !$routeSegment.contains('hsmFs'))
        return;

      var params = args.params;

      if (fsStream2) {
        fsStream2.destroy();
        hsmFs.fs = fsStream2 = null;
      }

      if (params.fsId) {
        fsStream2 = fsStream.property();
        p('fs', fsStream2.flatMap(highland.findWhere({ id: params.fsId })));
      }
    }

    $scope.$on('$destroy', function onDestroy () {
      fsStream.destroy();
      copytoolStream.destroy();
      remove();
    });
  });

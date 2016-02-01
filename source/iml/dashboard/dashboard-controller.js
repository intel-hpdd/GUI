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
import * as fp from 'intel-fp';

export default function DashboardCtrl ($scope, $location, $routeSegment,
                                       fsStream, hostStream, targetStream,
                                       filterTargetByFs, filterTargetByHost) {
  'ngInject';

  var fsStream2, hostStream2, targetStream2, targetSelectStream;

  const p = $scope.propagateChange($scope, this);

  var dashboard = angular.extend(this, {
    fs: {
      name: 'fs',
      selected: null,
      selectedTarget: null
    },
    host: {
      name: 'server',
      selected: null,
      selectedTarget: null
    },
    itemChanged: function itemChanged (item) {
      if (targetSelectStream)
        targetSelectStream.destroy();

      if (!item.selected) {
        item.selectedTarget = dashboard.targets = null;
      } else {
        var filter = (dashboard.fs === item ? filterTargetByFs : filterTargetByHost);

        targetSelectStream = targetStream.property();
        targetSelectStream
          .pluck('objects')
          .through(filter(item.selected.id))
          .map(fp.filter(function removeMgt (x) {
            return x.kind !== 'MGT';
          }))
          .through(p('targets'));
      }
    },
    onFilterView: function onFilterView (item) {
      dashboard.onCancel();

      var path = ['dashboard'];

      if (item.selected)
        path.push(item.name, item.selected.id);

      if (item.selectedTarget)
        path.push(item.selectedTarget.kind, item.selectedTarget.id);

      path = path.reduce(function (str, arg) {
        return (str += arg + '/');
      }, '');

      $location.path(path);
    },
    onConfigure: function onConfigure () {
      dashboard.configure = true;
    },
    onCancel: function onCancel () {
      dashboard.configure = false;
    }
  });

  dashboard.type = dashboard.fs;

  fsStream
    .through(p('fileSystems'));

  hostStream
    .pluck('objects')
    .through(p('hosts'));

  // Drain the stream so we don't buffer forever.
  targetStream
    .each(fp.noop);

  $scope.$on('$destroy', function onDestroy () {
    fsStream.destroy();
    hostStream.destroy();
    targetStream.destroy();
    remove();
  });

  var remove = $scope.$root.$on('$routeChangeSuccess', onRouteChangeSuccess);

  onRouteChangeSuccess(null, {
    params: $routeSegment.$routeParams
  });

  function onRouteChangeSuccess (ev, args) {
    if (args.redirectTo || !$routeSegment.contains('dashboard'))
      return;

    if (fsStream2) {
      fsStream2.destroy();
      dashboard.fsData = fsStream2 = null;
    }

    if (hostStream2) {
      hostStream2.destroy();
      hostStream2 = dashboard.hostData = null;
    }

    if (targetStream2) {
      targetStream2.destroy();
      targetStream2 = dashboard.targetData = null;
    }

    var params = args.params;

    setData(params);
  }

  function setData (params) {
    if (params.fsId) {
      fsStream2 = fsStream.property();
      fsStream2.flatMap(highland.findWhere({ id: params.fsId }))
        .through(p('fsData'));

      dashboard.type = dashboard.fs;
    } else if (params.serverId) {
      hostStream2 = hostStream.property();
      hostStream2
        .pluck('objects')
        .flatMap(highland.findWhere({ id: params.serverId }))
        .through(p('hostData'));

      dashboard.type = dashboard.host;
    }

    if (params.targetId) {
      targetStream2 = targetStream.property();
      targetStream2
        .pluck('objects')
        .flatMap(highland.findWhere({ id: params.targetId }))
        .through(p('targetData'));
    }
  }
}

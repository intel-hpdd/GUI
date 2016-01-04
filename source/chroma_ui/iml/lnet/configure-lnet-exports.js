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

import angular from 'angular/angular';
import * as fp from 'intel-fp/fp';


export function ConfigureLnetController ($scope, $exceptionHandler, socketStream, localApply,
                                        LNET_OPTIONS, waitForCommandCompletion, bigDiffer) {
  'ngInject';

  $exceptionHandler = fp.curry(1, $exceptionHandler);

  var idLens = fp.lensProp('id');
  var nidLens = fp.lensProp('nid');
  var lndNetworkLens = fp.flowLens(
    nidLens,
    fp.lensProp('lnd_network')
  );

  var typeLens = fp.flowLens(nidLens, fp.lensProp('lnd_type'));

  var mergeRemote, diffInitial, diffInitialRemote;

  var lensMap = {
    lndNetwork: lndNetworkLens,
    lndType: typeLens
  };

  var merge = bigDiffer.mergeColl(idLens, lensMap);
  var diffColl = bigDiffer.diffObjInColl3(idLens, lensMap);

  function getOptionName (record) {
    var predicate = fp
      .eqFn(lndNetworkLens, fp.lensProp('value'), record);

    return fp.find(predicate, LNET_OPTIONS).name;
  }

  $scope.configureLnet = {
    setEditable: function setEditable (editable) {
      $scope.configureLnet.editable = editable;

      if (!editable) {
        var remote = mergeRemote([]);
        $scope.configureLnet.networkInterfaces = remote;
        diffInitial = diffColl(angular.copy(remote));
        diffInitialRemote = diffInitial(fp.__, angular.copy(remote));
      }
    },
    networkInterfaces: [],
    options: LNET_OPTIONS,
    save: function save (skip) {
      $scope.configureLnet.saving = true;
      $scope.configureLnet.editable = false;

      socketStream('/nid', {
        method: 'post',
        json: {
          objects: fp.pluck('nid', $scope.configureLnet.networkInterfaces)
        }
      }, true)
        .flatMap(waitForCommandCompletion(!skip))
        .stopOnError($exceptionHandler)
        .each(function each () {
          $scope.configureLnet.saving = false;
          localApply($scope);
        });
    },
    getOptionName: getOptionName,
    diff: function diff (x) {
      return diffInitialRemote(x);
    },
    isDirty: function isDirty () {
      return $scope.configureLnet.networkInterfaces
        .map(diffInitialRemote)
        .some(function isEmpty (o) {
          return Object.keys(o).length;
        });
    },
    cleanLnd: function cleanLnd (record) {
      var lndChange = diffInitialRemote(record).lndType;
      lndChange.resetInitial(lndChange.diff.remote);
      lndChange.resetLocal(lndChange.diff.remote);
    },
    cleanLn: function cleanLn (record) {
      var lnChange = diffInitialRemote(record).lndNetwork;

      if (!lnChange)
        return;

      lnChange.resetInitial(lnChange.diff.remote);
      lnChange.resetLocal(lnChange.diff.remote);

      // Clean any records that have same lnd_network and are dirty.
      var xs = $scope.configureLnet.networkInterfaces
        .filter(fp.eqLens(lndNetworkLens, record));
      fp.difference(xs, [record])
        .forEach(cleanLn);
    }
  };

  $scope
    .networkInterfaceStream
    .tap(function setInitial (x) {
      if (!diffInitial)
        diffInitial = diffColl(angular.copy(x));
    })
    .tap(function setInitialRemote (x) {
      diffInitialRemote = diffInitial(fp.__, angular.copy(x));
    })
    .map(function setMergeRemote (x) {
      mergeRemote = merge(fp.__, angular.copy(x));

      return mergeRemote($scope.configureLnet.networkInterfaces);
    })
    .tap(fp.lensProp('networkInterfaces').set(fp.__, $scope.configureLnet))
    .stopOnError($exceptionHandler)
    .each(localApply.bind(null, $scope));

  $scope.$on('$destroy',
    $scope.networkInterfaceStream.destroy.bind($scope.networkInterfaceStream));
}

export function configureLnet () {
  return {
    templateUrl: 'iml/lnet/assets/html/configure-lnet.html',
    scope: {
      networkInterfaceStream: '=',
      activeFsMember: '='
    },
    restrict: 'E',
    controller: 'ConfigureLnetController'
  };
}

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

angular.module('corosyncModule')
  .controller('ConfigureCorosyncController', ['$scope', '$exceptionHandler', 'localApply',
    'socketStream', 'waitForCommandCompletion', 'bigDiffer',
    function ConfigureCorosyncController ($scope, $exceptionHandler, localApply,
                                          socketStream, waitForCommandCompletion, bigDiffer) {
      'use strict';

      var diffMcastInitial, mergeRemote;

      var lensMap = {
        mcastPort: fp.lensProp('mcast_port')
      };

      var merge = bigDiffer.mergeObj(lensMap);
      var diffMcast = bigDiffer.diffObj3(lensMap);
      var diffMcastInitialRemote = fp.noop;

      $scope.corosync = {
        alertStream: $scope.alertStream,
        jobStream: $scope.jobStream,
        stream: $scope.stream.observe(),
        reset: function reset () {
          var remote = mergeRemote(null);

          $scope.corosync.config = remote;
          diffMcastInitial = diffMcast(angular.copy(remote));
          diffMcastInitialRemote = diffMcastInitial(fp.__, angular.copy(remote));
        },
        diff: function diff (config) {
          return diffMcastInitialRemote(config).mcastPort;
        },
        setEditable: function setEditable (editable) {
          $scope.corosync.editable = editable;

          if (!editable)
            $scope.corosync.reset();
        },
        save: function save (skip) {
          $scope.corosync.saving = true;
          $scope.corosync.editable = false;
          diffMcastInitial = null;

          socketStream('/corosync_configuration/' + $scope.corosync.config.id, {
            method: 'put',
            json: $scope.corosync.config
          }, true)
            .flatMap(waitForCommandCompletion(!skip))
            .stopOnError(fp.curry(1, $exceptionHandler))
            .each(function each () {
              $scope.corosync.saving = false;
              localApply($scope);
            });
        }
      };

      $scope.stream
        .property()
        .tap(function setInitial (x) {
          if (!diffMcastInitial)
            diffMcastInitial = diffMcast(angular.copy(x));
        })
        .tap(function setInitialRemote (x) {
          diffMcastInitialRemote = diffMcastInitial(fp.__, angular.copy(x));
        })
        .map(function setMergeRemote (x) {
          return (mergeRemote = merge(fp.__, angular.copy(x)));
        })
        .map(function updateLocal (mergeRemote) {
          return mergeRemote($scope.corosync.config);
        })
        .tap(fp.lensProp('config').set(fp.__, $scope.corosync))
        .stopOnError(fp.curry(1, $exceptionHandler))
        .each(localApply.bind(null, $scope));

      $scope.$on('$destroy', function onDestroy () {
        $scope.stream.destroy();
        $scope.alertStream.destroy();
        $scope.jobStream.destroy();
      });
  }])
  .directive('configureCorosync', function configureCorosync () {
    return {
      templateUrl: 'iml/corosync/assets/html/configure-corosync.html',
      scope: {
        stream: '=',
        alertStream: '=',
        jobStream: '='
      },
      restrict: 'E',
      controller: 'ConfigureCorosyncController'
    };
  });

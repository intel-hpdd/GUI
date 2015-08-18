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

angular.module('statusModule')
  .controller('StatusController', ['$scope', 'socketStream',
    function StatusController ($scope, socketStream) {
      'use strict';

      var s = socketStream('/notification/', {
        qs: {
          limit: 0
        }
      })
        .pluck('objects')
        .tap(fp.lensProp('data').set(fp.__, this));

      s.each($scope.localApply.bind(null, $scope));

      var ctrl = this;

      this.onSubmit = function onSubmit (qs) {
        s.destroy();

        fp.lensProp('data').set([], ctrl);

        s = socketStream('/notification/?limit=0&' + qs)
          .pluck('objects')
          .tap(fp.lensProp('data').set(fp.__, this));

        s.each($scope.localApply.bind(null, $scope));
      };

      this.getType = function getType (type) {
        switch (type) {
          case 'Command':
            return 'command';
          case 'AlertState':
            return 'alert';
          case 'Event':
            return 'event';
          default:
            throw new Error('Type not expected.');
        }
      };
    }
  ]);

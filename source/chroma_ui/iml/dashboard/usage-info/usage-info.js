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

angular.module('dashboard')
  .controller('UsageInfoController', function UsageInfoController ($scope, $exceptionHandler, localApply,
                                                                   addProperty, formatNumber, formatBytes) {
    this.format = this.prefix === 'bytes' ? formatBytes : formatNumber;

    var normalize = fp.curry(2, function normalize (prefix, x) {
      [prefix + '_free', prefix + '_total'].forEach(function normalizeProps (key) {
        var single = key.split('_').join('');

        if (single in x)
          x[key] = x[single];
      });

      return x;
    });

    var addMetrics = fp.curry(2, function addMetrics (prefix, x) {
      x[prefix + '_used'] = x[prefix + '_total'] - x[prefix + '_free'];

      return x;
    });

    var prefix = this.prefix;
    this.generateStats = fp.map(function (x) {
      return [[
        {
          key: 'Free',
          y: x[prefix + '_free']
        },
        {
          key: 'Used',
          y: x[prefix + '_used']
        }
      ]];
    });

    var buildMetrics = fp.flow(
      fp.map(normalize(this.prefix)),
      fp.map(addMetrics(this.prefix))
    );

    var s = this.stream
      .flatten();

    if (this.id != null) {
      var idLens = fp.lensProp('id');
      var eqId = fp.eqFn(fp.identity, idLens, this.id);

      s = fp.filter(eqId, s);
    }

    this.s2 = addProperty(buildMetrics(s));

    this.s2
      .property()
      .tap(fp.lensProp('data').set(fp.__, this))
      .stopOnError(fp.curry(1, $exceptionHandler))
      .each(localApply.bind(null, $scope));
  })
  .directive('usageInfo', function usageInfoDirective () {
    return {
      restrict: 'E',
      scope: {
        stream: '=',
        prefix: '@',
        id: '=?'
      },
      controller: 'UsageInfoController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: 'iml/dashboard/usage-info/assets/html/usage-info.html'
    };
  });

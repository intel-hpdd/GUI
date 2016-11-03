//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import formatNumber from '../../number-formatters/format-number.js';
import formatBytes from '../../number-formatters/format-bytes.js';
import broadcaster from '../../broadcaster.js';
import usageInfoTemplate from './assets/html/usage-info.html!text';

export function UsageInfoController ($scope, propagateChange) {
  'ngInject';

  this.format = this.prefix === 'bytes' ? formatBytes : formatNumber;

  var normalize = fp.curry2(function normalize (prefix, x) {
    [prefix + '_free', prefix + '_total'].forEach(function normalizeProps (key) {
      var single = key.split('_').join('');

      if (single in x)
        x[key] = x[single];
    });

    return x;
  });

  var addMetrics = fp.curry2(function addMetrics (prefix, x) {
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

  var s = this
    .stream
    .flatten();

  if (this.id != null) {
    var eqId = fp.eqFn(
      fp.identity,
      fp.view(fp.lensProp('id')),
      this.id
    );

    s = fp.filter(eqId, s);
  }

  this.s2 = broadcaster(buildMetrics(s));

  this
    .s2()
    .through(propagateChange($scope, this, 'data'));
}

export function usageInfoDirective () {
  'ngInject';

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
    template: usageInfoTemplate
  };
}

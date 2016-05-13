// @flow

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

import {find, __} from 'intel-fp';
import type {HighlandStream} from 'intel-flow-highland/include/highland.js';

export default () => ({
  restrict: 'A',
  transclude: true,
  template: `
<a id="help-menu" ng-href="/static/webhelp/help_wrapper.html{{$ctrl.qs}}" target="_blank">
  <i class="fa fa-question-circle"></i> Help
</a>
  `,
  controllerAs: '$ctrl',
  bindToController: 'true',
  controller (routeStream:() => HighlandStream, $scope:Object, propagateChange:Function) {
    'ngInject';

    this.qs = '';

    const rs = routeStream();

    const p = propagateChange($scope, this, 'qs');

    const map = {
      server: '?server_tab.htm',
      serverDetail: '?server_detail_page.htm',
      mgt: '?mgts_tab.htm',
      statusQuery: '?status_page.htm',
      hsm: '?hsm_page.htm',
      dashboard: '?dashboard_charts.htm'
    };

    rs
      .map(r => r.contains)
      .map(find(__, Object.keys(map)))
      .map(x => map[x] || '')
      .through(p);

    $scope.$on('$destroy', () => rs.destroy());
  }
});

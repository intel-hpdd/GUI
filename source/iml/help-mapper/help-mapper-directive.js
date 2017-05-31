// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

export default () => ({
  restrict: 'A',
  template: `
<a id="help-menu" ng-href="/static/webhelp/{{vm.page}}" target="_blank">
  <i class="fa fa-question-circle"></i> Help
</a>
  `,
  $scope: {},
  controllerAs: 'vm',
  bindToController: 'true',
  controller ($state:Object, $transitions:Object) {
    'ngInject';

    const getPage = ($current) => withDefault(
      () => '',
      Maybe
        .of($current.data && $current.data.helpPage)
        .map(x => '?' + x)
    );

    this.page = getPage($state.$current);

    $transitions.onSuccess(
      {},
      transition =>
        this.page = getPage(transition.router.globals.$current)
    );
  }
});

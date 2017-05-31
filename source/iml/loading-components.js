// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type {
  $scopeT
} from 'angular';

export const uiLoaderViewRootComponent = {
  controller: function ($transitions:Object) {
    'ngInject';

    let loadStartListeners = [];
    let loadFinishListeners = [];

    const removeOnStart = $transitions.onStart(
      {},
      t => loadStartListeners.forEach(l => l(t))
    );

    const removeOnSuccess = $transitions.onSuccess(
      {},
      t => loadFinishListeners.forEach(l => l(t))
    );

    this.addStartListener = (l) => loadStartListeners.push(l);
    this.addFinishListener = (l) => loadFinishListeners.push(l);

    this.removeStartListener = (l) => loadStartListeners = loadStartListeners.filter(x => x !== l);
    this.removeFinishListener = (l) => loadFinishListeners = loadFinishListeners.filter(x => x !== l);

    this.$onDestroy = () => {
      removeOnStart();
      removeOnSuccess();
    };
  }
};

export const uiLoaderViewDirective = () => {
  'ngInject';

  return {
    scope: true,
    controller: () => {},
    bindToController: {
      loadOnce: '<',
      mightSkip: '<'
    },
    controllerAs: '$ctrl',
    require: ['^uiLoaderViewRoot', 'uiLoaderView'],
    link($scope:$scopeT & { loading:boolean }, el:HTMLElement[], attrs:Object, ctrls:Object[]) {
      const [
        parent,
        ctrl
      ] = ctrls;

      $scope.loading = true;

      const startListener = t => {
        if (ctrl.loadOnce && !$scope.loading)
          return;

        const from = t.from();
        const to = t.to();
        const data = to.data || {};
        const skipWhen = data.skipWhen || (() => false);

        if (ctrl.mightSkip && skipWhen(from.name, to.name))
          return;

        $scope.loading = true;
      };

      const finishListener = () => {
        $scope.loading = false;
      };

      parent.addStartListener(startListener);
      parent.addFinishListener(finishListener);
      $scope.$on('$destroy', () => {
        parent.removeStartListener(startListener);
        parent.removeFinishListener(finishListener);
      });
    },
    template: `
    <div class="spinner-container" ng-if="loading">
      <h2 class="loading-page text-center">
        Loading <i class="fa fa-spinner fa-spin fa-lg"></i>
      </h2>
    </div>
    <div class="loader-content" ng-class="{transparent: loading}">
      <div ui-view></div>
    </div>`
  };
};

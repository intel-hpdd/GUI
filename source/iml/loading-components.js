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
    link($scope:$scopeT & { loading: boolean }, el:HTMLElement[], attrs:Object, ctrls:Object[]) {
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

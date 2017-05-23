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

export function fullScreenBtn() {
  return {
    restrict: 'A',
    template: `<span ng-if="fullScreenCtrl.isFullScreen">Exit Full Screen <i class="fa fa-compress"></i></span>
<span ng-if="!fullScreenCtrl.isFullScreen">Full Screen <i class="fa fa-expand"></i></span>`,
    require: '^fullScreen',
    scope: {},
    link: function link(scope, wrappedEl, attrs, fullScreenCtrl) {
      scope.fullScreenCtrl = fullScreenCtrl;

      const applyAndToggleFullScreen = scope.$apply.bind(
        scope,
        toggleFullScreen
      );

      clickHandler('on');
      scope.$on('$destroy', clickHandler.bind(null, 'off'));

      function toggleFullScreen() {
        scope.fullScreenCtrl.isFullScreen = !scope.fullScreenCtrl.isFullScreen;

        fullScreenCtrl.fullScreen(scope.fullScreenCtrl.isFullScreen);
      }

      function clickHandler(type) {
        wrappedEl[type]('click', applyAndToggleFullScreen);
      }
    }
  };
}

export function fullScreen() {
  return {
    restrict: 'C',
    controller: function FullScreenCtrl($element, $scope, $document) {
      'ngInject';
      let body = $document.find('body');
      const fullScreenContainerClass = 'full-screen-container';
      const listeners = [];

      $scope.$on('$destroy', () => {
        listeners.length = 0;

        body.removeClass(fullScreenContainerClass);
        body = null;
      });

      angular.extend(this, {
        isFullScreen: false,
        fullScreen(fullScreenMode) {
          this.isFullScreen = fullScreenMode;
          body.toggleClass(fullScreenContainerClass, fullScreenMode);
          $element.toggleClass('active', fullScreenMode);

          listeners.forEach(func => func(fullScreenMode));
        },
        addListener(func) {
          listeners.push(func);
        },
        removeListener(func) {
          const index = listeners.indexOf(func);

          if (index !== -1) listeners.splice(index, 1);
        }
      });
    }
  };
}

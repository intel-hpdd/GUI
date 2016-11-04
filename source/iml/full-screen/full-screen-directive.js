//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';

import fullScreenButtonTextTemplate from './assets/html/full-screen-button-text.html!text';

export function fullScreenBtn () {
  return {
    restrict: 'A',
    template: fullScreenButtonTextTemplate,
    require: '^fullScreen',
    scope: {},
    link: function link (scope, wrappedEl, attrs, fullScreenCtrl) {
      scope.fullScreenCtrl = fullScreenCtrl;

      const applyAndToggleFullScreen = scope.$apply.bind(scope, toggleFullScreen);

      clickHandler('on');
      scope.$on('$destroy', clickHandler.bind(null, 'off'));

      function toggleFullScreen () {
        scope.fullScreenCtrl.isFullScreen = !scope.fullScreenCtrl.isFullScreen;

        fullScreenCtrl.fullScreen(scope.fullScreenCtrl.isFullScreen);
      }

      function clickHandler (type) {
        wrappedEl[type]('click', applyAndToggleFullScreen);
      }
    }
  };
}

export function fullScreen () {
  return {
    restrict: 'C',
    controller: function FullScreenCtrl ($element, $scope, $document) {
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
        fullScreen (fullScreenMode) {
          this.isFullScreen = fullScreenMode;
          body.toggleClass(fullScreenContainerClass, fullScreenMode);
          $element.toggleClass('active', fullScreenMode);

          listeners.forEach((func) => func(fullScreenMode));
        },
        addListener (func) {
          listeners.push(func);
        },
        removeListener (func) {
          const index = listeners.indexOf(func);

          if (index !== -1)
            listeners.splice(index, 1);
        }
      });
    }
  };
}

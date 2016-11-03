//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import waitUntilLoadedTemplate from './assets/html/wait-until-loaded-step.html!text';

export function waitUntilLoadedCtrl ($scope) {
  'ngInject';

  $scope.wait = {
    close: function close () {
      $scope.$emit('addServerModal::closeModal');
    }
  };
}

export function waitUntilLoadedStep () {
  'ngInject';

  return {
    controller: 'WaitUntilLoadedCtrl',
    template: waitUntilLoadedTemplate
  };
}

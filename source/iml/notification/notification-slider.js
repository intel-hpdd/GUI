//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

import notificationSliderTemplate from './assets/html/notification-slider.html!text';


export function NotificationSliderController ($scope, $timeout, localApply, $exceptionHandler) {
  'ngInject';

  let promise;

  const closeAfter5Seconds = $timeout.bind(
    null,
    () => $scope.open = false,
    5000
  );

  const objectLens = fp.lensProp('objects');

  this
    .stream
    .map(
      fp.view(
        fp.compose(
          objectLens,
          fp.mapped,
          fp.lensProp('message')
        )
      )
    )
    .map(fp.view(objectLens))
    .filter(fp.view(fp.lensProp('length')))
    .stopOnError(fp.unary($exceptionHandler))
    .each(function (x) {
      if (x.length > 1)
        $scope.message = x.length + ' active alerts';
      else
        $scope.message = x[0];

      $scope.open = true;

      $timeout.cancel(promise);
      promise = closeAfter5Seconds();

      localApply($scope);
    });

  $scope.enter = function enter () {
    $timeout.cancel(promise);
  };

  $scope.leave = function leave () {
    promise = closeAfter5Seconds();
  };

  $scope.close = function close () {
    $timeout.cancel(promise);
    $scope.open = false;
  };
}

export function notificationSlider () {
  'ngInject';

  return {
    restrict: 'E',
    scope: {
      stream: '='
    },
    controllerAs: 'ctrl',
    bindToController: true,
    template: notificationSliderTemplate,
    controller: 'NotificationSliderController'
  };
}

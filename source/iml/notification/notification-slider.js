// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function NotificationSliderController($scope, $timeout, localApply, $exceptionHandler) {
  "ngInject";
  let promise;

  const closeAfter5Seconds = $timeout.bind(null, () => ($scope.open = false), 5000);

  this.stream
    .map(xs => xs.map(x => x.message))
    .filter(xs => xs.length)
    .stopOnError(e => $exceptionHandler(e))
    .each(function(x) {
      if (x.length > 1) $scope.message = x.length + " active alerts";
      else $scope.message = x[0];

      $scope.open = true;

      $timeout.cancel(promise);
      promise = closeAfter5Seconds();

      localApply($scope);
    });

  $scope.enter = function enter() {
    $timeout.cancel(promise);
  };

  $scope.leave = function leave() {
    promise = closeAfter5Seconds();
  };

  $scope.close = function close() {
    $timeout.cancel(promise);
    $scope.open = false;
  };
}

export function notificationSlider() {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      stream: "="
    },
    controllerAs: "ctrl",
    bindToController: true,
    template: `<div class='notification-slider' ng-if='open' ng-mouseenter='enter()' ng-mouseleave='leave()'>
  <div class='notification-message'>
    <h4>
      <i class='fa fa-exclamation-triangle' style='margin-right: 6px;'></i>{{ message }}
    </h4>
  </div>

  <div class='btn-group btn-group-justified btn-block'>
    <a type='button' class='btn btn-block btn-danger' ng-click='close()'>Close<i class='fa fa-times-circle-o'></i></a>
    <a type='button' class='btn btn-block btn-danger' href='/ui/status/?severity__in=WARNING,ERROR&active=true'>Details<i class='fa fa-arrow-circle-o-right'></i></a>
  </div>
</div>`,
    controller: "NotificationSliderController"
  };
}

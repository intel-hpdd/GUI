//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default function overrideButtonDirective(OVERRIDE_BUTTON_TYPES) {
  'ngInject';
  return {
    restrict: 'E',
    scope: {
      overridden: '=',
      isDisabled: '=',
      isValid: '=',
      onChange: '&'
    },
    template: `<span ng-if="isDisabled">
  <button disabled class="btn btn-success">Working <i class="fa fa-spinner fa-spin"></i></button>
</span>
<span ng-if="!isDisabled">
  <span ng-if="!isValid">
    <button class="btn btn-warning override" ng-if="!overridden" ng-click="buttonClicked(types.OVERRIDE)">Override <i class="fa fa-exclamation-triangle"></i></button>
    <div class="btn-group proceed" ng-if="overridden" uib-dropdown>
      <button type="button" ng-click="buttonClicked(types.PROCEED)" class="btn btn-danger">Proceed <i class="fa fa-check-circle-o"></i></button>
      <button type="button" class="btn btn-danger" uib-dropdown-toggle>
        <span class="caret"></span>
        <span class="sr-only">Split button</span>
      </button>
      <ul role="menu" uib-dropdown-menu>
        <li>
          <a ng-click="buttonClicked(types.PROCEED_SKIP)">Proceed and skip command view</a>
        </li>
      </ul>
    </div>
  </span>
  <span ng-if="isValid">
    <div class="btn-group proceed" uib-dropdown>
      <button type="button" ng-click="buttonClicked(types.PROCEED)" class="btn btn-success">Proceed <i class="fa fa-check-circle-o"></i></button>
      <button type="button" class="btn btn-success" uib-dropdown-toggle>
        <span class="caret"></span>
        <span class="sr-only">Split button</span>
      </button>
      <ul role="menu" uib-dropdown-menu>
        <li>
          <a ng-click="buttonClicked(types.PROCEED_SKIP)">Proceed and skip command view</a>
        </li>
      </ul>
    </div>
  </span>
</span>`,
    link: function link(scope) {
      scope.types = OVERRIDE_BUTTON_TYPES;

      scope.buttonClicked = function buttonClicked(message) {
        if (message === OVERRIDE_BUTTON_TYPES.OVERRIDE) scope.overridden = true;
        else scope.isDisabled = true;

        scope.onChange({ message: message });
      };
    }
  };
}

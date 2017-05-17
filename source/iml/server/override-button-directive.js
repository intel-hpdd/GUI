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

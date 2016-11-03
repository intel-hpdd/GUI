//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import overrideButtonTemplate from './assets/html/override-button.html!text';

export default function overrideButtonDirective (OVERRIDE_BUTTON_TYPES) {
  'ngInject';

  return {
    restrict: 'E',
    scope: {
      overridden: '=',
      isDisabled: '=',
      isValid: '=',
      onChange: '&'
    },
    template: overrideButtonTemplate,
    link: function link (scope) {
      scope.types = OVERRIDE_BUTTON_TYPES;

      scope.buttonClicked = function buttonClicked (message) {
        if (message === OVERRIDE_BUTTON_TYPES.OVERRIDE)
          scope.overridden = true;
        else
          scope.isDisabled = true;

        scope.onChange({ message: message });
      };
    }
  };
}

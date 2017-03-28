// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { CompletionistCtrl } from './completionist.js';
import { VALUES, VALUE, KEY_PRESS } from './completionist.js';

const CompletionistDropdownCtrl = class {
  values: Array<?string> = [];
  index: number = -1;
  completionist: CompletionistCtrl;
  localApply: Function;
  $onDestroy: Function;
  constructor($scope: Object, localApply: Function) {
    'ngInject';
    this.localApply = localApply.bind(null, $scope);
  }
  $onInit() {
    const onKeyPress = x => {
      if (this.values.length === 0) return;

      const maxVal = this.values.length + 1;

      switch (x.name) {
        case 'escape':
          x.event.preventDefault();
          this.completionist.emit(VALUES, []);
          break;
        case 'up':
          x.event.preventDefault();
          this.index = (maxVal + (this.index - 1)) % maxVal;
          this.localApply();
          break;
        case 'down':
          x.event.preventDefault();
          this.index = (this.index + 1) % maxVal;
          this.localApply();
          break;
        case 'enter':
        case 'tab':
          if (this.values[this.index] != null) {
            x.event.preventDefault();
            this.completionist.emit(VALUE, this.values[this.index]);
          }
          break;
      }
    };
    this.completionist.register(KEY_PRESS, onKeyPress);

    const onValues = values => {
      this.index = -1;
      this.values = values;
      this.localApply();
    };
    this.completionist.register(VALUES, onValues);

    this.$onDestroy = () => {
      this.completionist.deregister(KEY_PRESS, onKeyPress);
      this.completionist.deregister(VALUES, onValues);
    };
  }
  setActive(index: number): void {
    this.index = index;
  }
  onSelect(value: string): void {
    this.completionist.emit(VALUE, value);
  }
};

export default {
  require: {
    completionist: '^completionist'
  },
  controller: CompletionistDropdownCtrl,
  template: `
    <ul ng-if='$ctrl.values.length > 0'>
      <li
        ng-class="{active: $index === $ctrl.index}"
        ng-repeat="x in $ctrl.values track by x.suggestion"
        ng-mousedown="$event.preventDefault()"
        ng-click="$ctrl.onSelect(x)"
        ng-mouseover="$ctrl.setActive($index)"
      >
        {{::x.suggestion}}
      </li>
    </ul>
  `
};

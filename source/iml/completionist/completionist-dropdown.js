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

import type {CompletionistCtrl} from './completionist.js';
import {VALUES, VALUE, KEY_PRESS} from './completionist.js';

const CompletionistDropdownCtrl = class {
  values:Array<?string> = [];
  index:number = -1;
  completionist: CompletionistCtrl;
  localApply: Function;
  $onDestroy: Function;
  constructor ($scope:Object, localApply:Function) {
    'ngInject';
    this.localApply = localApply.bind(null, $scope);
  }
  $onInit () {
    const onKeyPress = x => {
      if (this.values.length === 0)
        return;

      const maxVal = this.values.length + 1;

      switch (x.name) {
      case 'Escape':
        x.event.preventDefault();
        this.completionist.emit(VALUES, []);
        break;
      case 'ArrowUp':
        x.event.preventDefault();
        this.index = (maxVal + (this.index - 1)) % maxVal;
        this.localApply();
        break;
      case 'ArrowDown':
        x.event.preventDefault();
        this.index = (this.index + 1) % maxVal;
        this.localApply();
        break;
      case 'Enter':
      case 'Tab':
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
  setActive (index:number):void {
    this.index = index;
  }
  onSelect (value:string):void {
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

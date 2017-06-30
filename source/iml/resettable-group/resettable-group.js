// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';

type ctrl = {
  $name: string,
  $addControl: Function,
  $formatters: Array<(val: any) => any>,
  $setViewValue: (val: any, evt?: string) => void,
  $setPristine: () => void,
  $setUntouched: () => void,
  $render: () => void
};

type itm = {
  initialValue: any,
  item: ctrl
};

export const ResettableGroupController = class {
  controls: Array<itm> = [];
  formCtrl: ctrl;
  localApply: Function;

  constructor($scope: Object, localApply: Function) {
    'ngInject';
    this.localApply = localApply.bind(null, $scope);
  }

  $onInit() {
    const addControl = (control: ctrl): ctrl => {
      if (control.$name === '') return control;

      if (control.$addControl) {
        control.$addControl = fp.flow(
          addControl,
          fp.bindMethod('$addControl')(control)
        );

        return control;
      }

      const item = { initialValue: undefined, item: control };
      this.controls.push(item);
      const setOnce = fp.once(val => (item.initialValue = val));

      control.$formatters.push(x => {
        setOnce(x);
        return x;
      });

      return control;
    };

    addControl(this.formCtrl);
  }

  reset() {
    this.controls.forEach(entry => {
      entry.item.$setViewValue(entry.initialValue);
      entry.item.$setPristine();
      entry.item.$setUntouched();
      entry.item.$render();
    });

    this.localApply();
  }
};

export default {
  scope: {},
  require: {
    formCtrl: '^form'
  },
  controller: ResettableGroupController
};

// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { diffComponentCtrl } from './diff-component';

export const DiffModelCtrl = class {
  modelCtrl: {
    $formatters: Array<Function>,
    $viewChangeListeners: Array<Function>,
    $viewValue: string,
    $render: Function
  };
  diffCtrl: diffComponentCtrl;
  $onInit() {
    this.modelCtrl.$formatters.push(this.diffCtrl.remoteChange);

    this.modelCtrl.$viewChangeListeners.push(() => {
      this.diffCtrl.localChange(this.modelCtrl.$viewValue);
    });

    this.diffCtrl.subscribe(x => {
      if (x.local == null || this.modelCtrl.$viewValue === x.local) return;

      this.modelCtrl.$setViewValue(x.local);
      this.modelCtrl.$render();
    });
  }
};

export default function diffModel(): Object {
  return {
    restrict: 'A',
    bindToController: 'true',
    require: {
      modelCtrl: 'ngModel',
      diffCtrl: '^differ'
    },
    controller: DiffModelCtrl
  };
}

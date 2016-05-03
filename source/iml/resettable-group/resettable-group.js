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

import {tap, once} from 'intel-fp';

type ctrl = {
  $name: string,
  $addControl:Function,
  $formatters:Array<(val:any) => any>,
  $setViewValue: (val:any, evt?:string) => void,
  $setPristine: () => void,
  $setUntouched: () => void,
  $render: () => void
};

type itm = {
  initialValue: any,
  item: ctrl
};

export const ResettableGroupController = class {
  controls:Array<itm> = [];
  formCtrl:{
    $addControl: (control:ctrl) => void
  };
  localApply:Function;

  constructor ($scope:Object, localApply:Function) {
    'ngInject';
    this.localApply = localApply.bind(null, $scope);
  }

  $onInit () {
    const oldAddControl = this.formCtrl.$addControl;
    const addControl = (control:ctrl) => {
      oldAddControl.call(this.formCtrl, control);

      if (control.$name === '')
        return;

      if (control.$addControl !== undefined) {
        control.$addControl = addControl;
        return;
      }

      const item = {initialValue: undefined, item: control};
      this.controls.push(item);
      control.$formatters.push(tap(once(val => item.initialValue = val)));
    };

    this.formCtrl.$addControl = addControl;
  }

  reset () {
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

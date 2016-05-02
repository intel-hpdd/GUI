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

export type ResettableGroupControllerType = {
  $onInit:() => void,
  reset:() => void
};

type ControlType = {
  $name: string,
  $addControl:Function,
  $submitted?:boolean, 
  $formatters:Array<(val:any) => any>,
  $setViewValue: (val:any, evt?:string) => void,
  $setPristine: () => void,
  $setUntouched: () => void,
  $render: () => void
};

type ItemType = {
  initialValue: any,
  item: ControlType
};

const ResettableGroupController = class {
  elements:Array<ItemType>;
  formCtrl:Object;

  $onInit () {
    var resettableGroupController = this;
    this.elements = [];

    const oldAddControl = this.formCtrl.$addControl;
    this.formCtrl.$addControl = function addControl (control:ControlType) {
      oldAddControl(control);

      if (control.$name === '')
        return;

      if (control.$submitted !== undefined) {
        control.$addControl = addControl;
        return;
      }

      const item = {initialValue: undefined, item: control};
      resettableGroupController.elements.push(item);

      control.$formatters.push(val => {
        item.initialValue = val;
        return val;
      });
    };
  }

  reset () {
    this.elements.forEach(entry => {
      entry.item.$setViewValue(entry.initialValue);
      entry.item.$setPristine();
      entry.item.$setUntouched();
      entry.item.$render();
    });
  }
};

export default {
  scope: {},
  require: {
    formCtrl: '^form'
  },
  controller: ResettableGroupController
};

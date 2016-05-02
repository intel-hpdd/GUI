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

import {CompletionistCtrl, VALUES, VALUE, KEY_PRESS} from './completionist.js';
import {tap} from 'intel-fp';

type ctrl = {
  completionist: CompletionistCtrl;
  ngModel: {
    $viewValue: string;
    $parsers: Array<Function>;
    $setViewValue: (value:string) => void;
    $render: () => void;
  };
};

export default function completionistModelHook ($document:Array<Document>) {
  'ngInject';

  return {
    require: {
      ngModel: 'ngModel',
      completionist: '^completionist'
    },
    link (scope:{$on:Function}, element:Array<HTMLInputElement>, attrs:{}, ctrl:ctrl) {
      const el = element[0];

      ctrl.ngModel.$parsers.unshift(
        tap(
          (value:string):void =>
            ctrl.completionist.parse(
              value,
              el.selectionStart
            )
        )
      );

      const onValue = value => {
        const viewValue = ctrl.ngModel.$viewValue;
        const text = !isFinite(value.start) ?
          `${viewValue}${viewValue.length ? ' ' : ''}${value.suggestion}` :
          `${viewValue.slice(0, value.start)}${value.suggestion || ''}${viewValue.slice(value.end)}`;

        ctrl.ngModel.$setViewValue(text);
        ctrl.ngModel.$render();
      };
      ctrl.completionist.register(VALUE, onValue);

      const onKeyDown = event => {
        const emitKeyPress = (name:string) => {
          ctrl.completionist.emit(KEY_PRESS, {
            name,
            event
          });
        };

        switch (event.keyCode) {
        case 38:
          emitKeyPress('up');
          break;
        case 40:
          emitKeyPress('down');
          break;
        case 13:
          emitKeyPress('enter');
          break;
        case 27:
          emitKeyPress('escape');
          break;
        case 9:
          emitKeyPress('tab');
          break;
        }
      };
      el.addEventListener('keydown', onKeyDown);

      var isFocused = false;

      const onFocus = () => {
        if (isFocused)
          return;

        isFocused = true;

        return ctrl.completionist.parse(
          ctrl.ngModel.$viewValue,
          el.selectionStart
        );
      };
      el.addEventListener('focus', onFocus);

      const onBlur = () => {
        if ($document[0].activeElement === el) return;

        isFocused = false;
        ctrl.completionist.emit(VALUES, []);
      };
      el.addEventListener('blur', onBlur);

      scope.$on('$destroy', () => {
        ctrl.completionist.deregister(VALUE, onValue);
        el.removeEventListener('keydown', onKeyDown);
        el.removeEventListener('focus', onFocus);
        el.removeEventListener('blur', onBlur);
      });
    }
  };
}

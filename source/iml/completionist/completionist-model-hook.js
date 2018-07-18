// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { CompletionistCtrl, VALUES, VALUE, KEY_PRESS } from './completionist.js';

type controller = {
  completionist: CompletionistCtrl,
  ngModel: {
    $viewValue: string,
    $parsers: Array<Function>,
    $setViewValue: (value: string) => void,
    $render: () => void
  }
};

export default function completionistModelHook($document: Document[]) {
  'ngInject';
  return {
    require: {
      ngModel: 'ngModel',
      completionist: '^completionist'
    },
    link(scope: { $on: Function }, element: Array<HTMLInputElement>, attrs: {}, ctrl: controller) {
      const el = element[0];

      ctrl.ngModel.$parsers.unshift(
        (value: string): string => {
          ctrl.completionist.parse(value, el.selectionStart);

          return value;
        }
      );

      const onValue = value => {
        const viewValue = ctrl.ngModel.$viewValue;
        const text = !isFinite(value.start)
          ? `${viewValue}${viewValue.length ? ' ' : ''}${value.suggestion}`
          : `${viewValue.slice(0, value.start)}${value.suggestion || ''}${viewValue.slice(value.end)}`;

        ctrl.ngModel.$setViewValue(text);
        ctrl.ngModel.$render();
      };
      ctrl.completionist.register(VALUE, onValue);

      const onKeyDown = (event: KeyboardEvent) => {
        const emitKeyPress = (name: string) => {
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

      let isFocused = false;

      const onFocus = () => {
        if (isFocused) return;

        isFocused = true;

        ctrl.completionist.parse(ctrl.ngModel.$viewValue, el.selectionStart);
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

// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { ResettableGroupController } from './resettable-group';

type scp = {
  $on: (evt: string, callback: () => void) => void
};

export default () => {
  'ngInject';
  return {
    restrict: 'A',
    scope: {},
    require: '^resettableGroup',
    link: (scope: scp, element: Array<HTMLElement>, attrs: Object, resettableGroupCtrl: ResettableGroupController) => {
      function onClick() {
        resettableGroupCtrl.reset();
      }

      const el = element[0];
      el.addEventListener('click', onClick);

      scope.$on('$destroy', () => {
        el.removeEventListener('click', onClick);
      });
    }
  };
};

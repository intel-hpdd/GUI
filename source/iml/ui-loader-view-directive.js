// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { $scopeT, $animationT } from 'angular';

import type { TransitionT, StateDeclarationT } from 'angular-ui-router';

import { querySelector } from './dom-utils.js';

import * as fp from '@iml/fp';

type ctrlT = {
  loaded: boolean,
  child: ?ctrlT,
  parent: ?ctrlT,
  loadOnce: boolean
};

type dataT = {
  noSpinner: boolean
};

export default ($transitions: TransitionT, $animate: $animationT) => {
  'ngInject';
  return {
    scope: true,
    controller: () => {},
    bindToController: {
      loadOnce: '<'
    },
    require: ['uiLoaderView', '^^?uiLoaderView'],
    controllerAs: '$ctrl',
    link($scope: $scopeT, el: HTMLElement[], attrs: Object, ctrls: [ctrlT, ctrlT]) {
      const [ctrl: ctrlT, parent: ?ctrlT] = ctrls;
      const uiLoaderView: HTMLElement = el[0];

      ctrl.loaded = false;

      if (parent) {
        ctrl.parent = parent;
        parent.child = ctrl;
      }

      const removeOnStart: () => void = $transitions.onStart({}, (t: TransitionT) => {
        if (ctrl.loadOnce && ctrl.loaded) return;

        const from = t.from();
        const to = t.to();
        const data: dataT = to.data || { noSpinner: false };

        if (!isLoaderMatch(ctrl, from, to)) return;

        ctrl.loaded = true;

        if (!data.noSpinner) uiLoaderView.classList.add('waiting');

        return $animate.leave(querySelector(uiLoaderView, '[ui-view]'));
      });

      $animate.on('enter', uiLoaderView, (element, phase) => {
        if (querySelector(uiLoaderView, '[ui-view]') === element[0] && phase === 'start')
          uiLoaderView.classList.remove('waiting');
      });

      $scope.$on('$destroy', () => {
        removeOnStart();
        $animate.off('enter', uiLoaderView);

        if (parent) parent.child = null;
      });
    },
    template: '<div ui-view></div>'
  };
};

function isLoaderMatch(ctrl: ctrlT, from: StateDeclarationT, to: StateDeclarationT) {
  const fromSplit = from.name.split('.');
  const toSplit = to.name.split('.');
  const diff = fp.difference(fromSplit)(toSplit);
  const samePartsList = fromSplit.slice(0, -diff.length);

  let curNode = ctrl;
  let count = 0;
  while (curNode.parent != null) {
    curNode = curNode.parent;
    count++;
  }

  return count === samePartsList.length || (diff.length === 0 && toSplit.length - 1 === count);
}

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

import type { $scopeT, $animationT } from 'angular';

import type { TransitionT, StateDeclarationT } from 'angular-ui-router';

import * as fp from 'intel-fp';

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
    link(
      $scope: $scopeT,
      el: HTMLElement[],
      attrs: Object,
      ctrls: [ctrlT, ctrlT]
    ) {
      const [ctrl: ctrlT, parent: ?ctrlT] = ctrls;
      const uiLoaderView: HTMLElement = el[0];

      ctrl.loaded = false;

      if (parent) {
        ctrl.parent = parent;
        parent.child = ctrl;
      }

      const removeOnStart: () => void = $transitions.onStart(
        {},
        (t: TransitionT) => {
          if (ctrl.loadOnce && ctrl.loaded) return;

          const from = t.from();
          const to = t.to();
          const data: dataT = to.data || { noSpinner: false };

          if (!isLoaderMatch(ctrl, from, to)) return;

          ctrl.loaded = true;

          if (!data.noSpinner) uiLoaderView.classList.add('waiting');

          return $animate.leave(uiLoaderView.querySelector('[ui-view]'));
        }
      );

      $animate.on('enter', uiLoaderView, (element, phase) => {
        if (
          uiLoaderView.querySelector('[ui-view]') === element[0] &&
          phase === 'start'
        )
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

function isLoaderMatch(
  ctrl: ctrlT,
  from: StateDeclarationT,
  to: StateDeclarationT
) {
  const fromSplit = from.name.split('.');
  const toSplit = to.name.split('.');
  const diff = fp.difference(fromSplit, toSplit);
  const samePartsList = fromSplit.slice(0, -diff.length);

  let curNode = ctrl;
  let count = 0;
  while (curNode.parent != null) {
    curNode = curNode.parent;
    count++;
  }

  return count === samePartsList.length ||
    (diff.length === 0 && toSplit.length - 1 === count);
}

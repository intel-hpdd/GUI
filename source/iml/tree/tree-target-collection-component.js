// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import store from '../store/get-store.js';

import type { $scopeT } from 'angular';

import * as fp from '@iml/fp';

import { toggleCollection } from './tree-utils.js';

import { emitOnItem, transformItems } from './tree-transforms.js';

import type { treeItemT } from './tree-types.js';

import type { PropagateChange } from '../extend-scope-module.js';

export default (kind: string) => {
  function treeTargetCollection($scope: $scopeT, propagateChange: PropagateChange) {
    'ngInject';
    Object.assign(this, {
      onOpen: toggleCollection,
      $onDestroy() {
        targetCollection$.destroy();
        t1.destroy();
      }
    });

    const fn = (x: treeItemT) => {
      return x.parentTreeId === this.parentId && x.fsId === this.fsId && x.type === kind;
    };

    function computePage(meta) {
      const currentPage = meta.offset / meta.limit + 1;
      return (currentPage - 1) * meta.limit;
    }

    const t1 = store.select('tree');

    t1.through(emitOnItem(fn)).through(propagateChange.bind(null, $scope, this, 'x'));

    const structFn = fp.always({
      type: kind,
      parentTreeId: this.parentId,
      fsId: this.fsId
    });

    const fnTo$ = item =>
      socketStream('/target/', {
        jsonMask: 'meta,objects(label,id,resource_uri)',
        qs: {
          offset: computePage(item.meta),
          limit: item.meta.limit,
          kind,
          filesystem_id: this.fsId
        }
      });

    const targetCollection$ = store.select('tree');

    targetCollection$.through(transformItems(fn, structFn, fnTo$)).each(store.dispatch);
  }

  return {
    template: `
  <div>
    <span ng-switch="$ctrl.x.meta == null">
      <i ng-switch-when="true" class="fa fa-fw fa-spin fa-refresh"></i>
      <i ng-switch-when="false" class="fa fa-fw fa-chevron-right" ng-click="$ctrl.onOpen($ctrl.x.treeId, !$ctrl.x.open)" ng-class="{'fa-rotate-90': $ctrl.x.open}"></i>
    </span>
    <i class="fa fa-fw fa-folder-o"></i> ${kind.toUpperCase()}s <span ng-if="$ctrl.x.meta != null">({{$ctrl.x.meta.total_count}})</span>
    <div class="children" ng-if="$ctrl.x.open">
      <tree-target-item
       ng-repeat="target in $ctrl.x.objects track by target.id"
       fs-id="$ctrl.fsId"
       record="target"
       kind="'${kind}'"
       ></tree-target-item>
       <tree-pager meta="$ctrl.x.meta" tree-id="::$ctrl.x.treeId"></tree-pager>
    </div>
  </div>
    `,
    bindings: {
      parentId: '<',
      fsId: '<'
    },
    controller: treeTargetCollection
  };
};

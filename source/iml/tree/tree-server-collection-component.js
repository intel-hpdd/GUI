// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import store from '../store/get-store.js';

import type { $scopeT } from 'angular';

import * as fp from 'intel-fp';

import { toggleCollection } from './tree-utils.js';

import { emitOnItem, transformItems } from './tree-transforms.js';

import type { treeItemT } from './tree-types.js';

function treeServerCollection($scope: $scopeT, propagateChange: Function) {
  'ngInject';
  Object.assign(this, {
    onOpen: toggleCollection,
    $onDestroy() {
      hostCollection$.destroy();
      t1.destroy();
    }
  });

  const fn = (x: treeItemT) =>
    x.parentTreeId === this.parentId && x.type === 'host';

  function computePage(meta) {
    const currentPage = meta.offset / meta.limit + 1;
    return (currentPage - 1) * meta.limit;
  }

  const t1 = store.select('tree');

  t1.through(emitOnItem(fn)).through(propagateChange($scope, this, 'x'));

  const structFn = fp.always({
    type: 'host',
    parentTreeId: this.parentId
  });

  const fnTo$ = item =>
    socketStream('/host/', {
      jsonMask: 'meta,objects(fqdn,id,resource_uri)',
      qs: {
        offset: computePage(item.meta),
        limit: item.meta.limit
      }
    });

  const hostCollection$ = store.select('tree');

  hostCollection$
    .through(transformItems(fn, structFn, fnTo$))
    .each(store.dispatch);
}

export default {
  template: `
<div>
  <span ng-switch="$ctrl.x.meta == null">
    <i ng-switch-when="true" class="fa fa-fw fa-spin fa-refresh"></i>
    <i ng-switch-when="false" class="fa fa-fw fa-chevron-right" ng-click="$ctrl.onOpen($ctrl.x.treeId, !$ctrl.x.open)" ng-class="{'fa-rotate-90': $ctrl.x.open}"></i>
  </span>
  <a ui-sref="app.server({ resetState: true })">
    <i class="fa fa-fw fa-folder-o"></i> Servers <span ng-if="$ctrl.x.meta != null">({{$ctrl.x.meta.total_count}})</span>
  </a>
  <div class="children" ng-if="$ctrl.x.open">
    <tree-server-item
     ng-repeat="host in $ctrl.x.objects track by host.id"
     parent="$ctrl.x"
     record="host"
     ></tree-server-item>
     <tree-pager meta="$ctrl.x.meta" tree-id="::$ctrl.x.treeId"></tree-pager>
  </div>
</div>
  `,
  bindings: {
    parentId: '<'
  },
  controller: treeServerCollection
};

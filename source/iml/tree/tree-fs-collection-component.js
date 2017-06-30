// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
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

function treeFsCollection($scope: $scopeT, propagateChange: PropagateChange) {
  'ngInject';
  Object.assign(this, {
    onOpen: toggleCollection,
    $onDestroy() {
      fsCollection$.destroy();
      t1.destroy();
    }
  });

  const fn = (x: treeItemT) =>
    x.parentTreeId === this.parentId && x.type === 'fs';

  function computePage(meta) {
    const currentPage = meta.offset / meta.limit + 1;
    return (currentPage - 1) * meta.limit;
  }

  const t1 = store.select('tree');

  t1
    .through(emitOnItem(fn))
    .through(propagateChange.bind(null, $scope, this, 'x'));

  const structFn = fp.always({
    type: 'fs',
    parentTreeId: this.parentId
  });

  const fnTo$ = item =>
    socketStream('/filesystem/', {
      jsonMask: 'meta,objects(label,id,resource_uri)',
      qs: {
        offset: computePage(item.meta),
        limit: item.meta.limit
      }
    });

  const fsCollection$ = store.select('tree');

  fsCollection$
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
  <a ui-sref="app.fileSystem({ resetState: true })">
    <i class="fa fa-fw fa-folder-o"></i> File Systems <span ng-if="$ctrl.x.meta != null">({{$ctrl.x.meta.total_count}})</span>
  </a>
  <div class="children" ng-if="$ctrl.x.open">
    <tree-fs-item
     ng-repeat="fs in $ctrl.x.objects track by fs.id"
     parent="$ctrl.x"
     record="fs"
     ></tree-fs-item>
     <tree-pager meta="$ctrl.x.meta" tree-id="::$ctrl.x.treeId"></tree-pager>
  </div>
</div>
  `,
  bindings: {
    parentId: '<'
  },
  controller: treeFsCollection
};

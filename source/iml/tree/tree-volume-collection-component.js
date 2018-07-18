// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import store from '../store/get-store.js';
import * as fp from '@iml/fp';

import { toggleCollection } from './tree-utils.js';

import { emitOnItem, transformItems } from './tree-transforms.js';

import type { treeItemT } from './tree-types.js';

import type { $scopeT } from 'angular';

import type { PropagateChange } from '../extend-scope-module.js';

function treeVolumeCollection($scope: $scopeT, propagateChange: PropagateChange) {
  'ngInject';
  function computePage(meta) {
    const currentPage = meta.offset / meta.limit + 1;
    return (currentPage - 1) * meta.limit;
  }

  const fn = (x: treeItemT) => x.parentTreeId === this.parentId && x.hostId === this.hostId && x.type === 'volume';

  const t1 = store.select('tree');

  t1.through(emitOnItem(fn)).through(propagateChange.bind(null, $scope, this, 'x'));

  const structFn = fp.always({
    type: 'volume',
    parentTreeId: this.parentId,
    hostId: this.hostId
  });

  const fnTo$ = item =>
    socketStream('/volume/', {
      jsonMask: 'meta,objects(label,id,resource_uri,size,status)',
      qs: {
        host_id: this.hostId,
        offset: computePage(item.meta),
        limit: item.meta.limit,
        order_by: 'label'
      }
    });

  const volumeCollection$ = store.select('tree');

  volumeCollection$.through(transformItems(fn, structFn, fnTo$)).each(store.dispatch);

  Object.assign(this, {
    onOpen: toggleCollection,
    $onDestroy: () => {
      volumeCollection$.destroy();
      t1.destroy();
    }
  });
}

export default {
  controller: treeVolumeCollection,
  bindings: {
    parentId: '<',
    hostId: '<'
  },
  template: `
<div class="col-12">
  <span ng-switch="$ctrl.x.meta == null">
    <i ng-switch-when="true" class="fa fa-fw fa-spin fa-refresh"></i>
    <i ng-switch-when="false"
      class="fa fa-fw fa-chevron-right"
      ng-class="{'fa-rotate-90': $ctrl.x.open}"
      ng-click="$ctrl.onOpen($ctrl.x.treeId, !$ctrl.x.open)"
    ></i>
  </span>
  <a ui-sref="app.oldVolume({ resetState: true })">
    <i class="fa fa-fw fa-folder-o"></i> Volumes <span ng-if="$ctrl.x.meta != null">({{$ctrl.x.meta.total_count}})</span>
  </a>
  <div class="children" ng-if="$ctrl.x.open">
    <tree-volume-item
     ng-repeat="volume in $ctrl.x.objects track by volume.id"
     parent="$ctrl.x"
     record="volume"
     ></tree-volume-item>
     <tree-pager meta="$ctrl.x.meta" tree-id="::$ctrl.x.treeId"></tree-pager>
  </div>
</div>
  `
};

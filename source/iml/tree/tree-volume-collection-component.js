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

import socketStream from '../socket/socket-stream.js';
import store from '../store/get-store.js';
import * as fp from '@mfl/fp';

import { toggleCollection } from './tree-utils.js';

import { emitOnItem, transformItems } from './tree-transforms.js';

import type { treeItemT } from './tree-types.js';

import type { $scopeT } from 'angular';

import type { PropagateChange } from '../extend-scope-module.js';

function treeVolumeCollection(
  $scope: $scopeT,
  propagateChange: PropagateChange
) {
  'ngInject';
  function computePage(meta) {
    const currentPage = meta.offset / meta.limit + 1;
    return (currentPage - 1) * meta.limit;
  }

  const fn = (x: treeItemT) =>
    x.parentTreeId === this.parentId &&
    x.hostId === this.hostId &&
    x.type === 'volume';

  const t1 = store.select('tree');

  t1
    .through(emitOnItem(fn))
    .through(propagateChange.bind(null, $scope, this, 'x'));

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

  volumeCollection$
    .through(transformItems(fn, structFn, fnTo$))
    .each(store.dispatch);

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

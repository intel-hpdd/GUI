// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import treeServerCollectionComponent from './tree-server-collection-component.js';
import treeVolumeCollectionComponent from './tree-volume-collection-component.js';
import treeServerItemComponent from './tree-server-item-component.js';
import treeVolumeItemComponent from './tree-volume-item-component.js';
import treeFsCollectionComponent from './tree-fs-collection-component.js';
import treeFsItemComponent from './tree-fs-item-component.js';
import treeTargetCollectionComponentFactory from './tree-target-collection-component.js';
import treeTargetItemComponent from './tree-target-item-component.js';
import treePagerComponent from './tree-pager.js';

export default angular
  .module('tree', [])
  .component('treeServerCollection', treeServerCollectionComponent)
  .component('treeVolumeCollection', treeVolumeCollectionComponent)
  .component('treeServerItem', treeServerItemComponent)
  .component('treeVolumeItem', treeVolumeItemComponent)
  .component('treeFsCollection', treeFsCollectionComponent)
  .component('treeFsItem', treeFsItemComponent)
  .component('treeOstCollection', treeTargetCollectionComponentFactory('ost'))
  .component('treeMgtCollection', treeTargetCollectionComponentFactory('mgt'))
  .component('treeMdtCollection', treeTargetCollectionComponentFactory('mdt'))
  .component('treeTargetItem', treeTargetItemComponent)
  .component('treePager', treePagerComponent).name;

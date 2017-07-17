// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';
import type { State } from './storage-reducer.js';

import TableFilter from './table-filter.js';
import Inferno from 'inferno';
import { ResourceTable } from './resource-table.js';
import { asViewer } from '../as-viewer/as-viewer';
import storageResources from './storage-resources.js';

type StorageProps = {
  storage: State,
  alertIndicatorB: () => HighlandStreamT<any>
};

const AddStorageDevice = () =>
  <div class="add-storage-device">
    <h4 class="section-header">Add Storage Device</h4>
    <button type="button" class="btn btn-default btn-sm">
      <i class="fa fa-plus-circle text-success" /> Add Storage Device
    </button>
  </div>;

const NoPlugins = () =>
  <div class="well text-center no-plugins">
    <h1>No storage plugins are currently installed.</h1>
    <p>
      When storage plugins are installed, use this tab to configure and view
      storage resources such as controllers.
    </p>
  </div>;

export const StorageComponent = asViewer(
  'storage',
  ({
    storage: {
      resourceClasses,
      resources,
      config: { selectIndex, loading, sortKey, sortDesc, entries }
    },
    alertIndicatorB
  }: StorageProps) => {
    if (!resourceClasses) return;

    return (
      <div class="container container-full storage container">
        {selectIndex != null && resourceClasses.length
          ? <div>
              <h4 class="section-header">Storage Resources</h4>
              <TableFilter classes={resourceClasses} idx={selectIndex} />
              <div className={`table-container ${loading ? 'loading' : ''}`}>
                {resources &&
                  <ResourceTable
                    resourceClass={resourceClasses[selectIndex]}
                    resources={resources}
                    alertIndicatorB={alertIndicatorB}
                    sortKey={sortKey}
                    sortDesc={sortDesc}
                    entries={entries}
                  />}
                <AddStorageDevice />
              </div>
            </div>
          : <NoPlugins />}
      </div>
    );
  }
);

export default {
  bindings: { alertIndicatorB: '<', storageB: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    const storageResources$ = storageResources().each(() => {});

    this.$onInit = () => {
      Inferno.render(
        <StorageComponent
          alertIndicatorB={this.alertIndicatorB}
          viewer={this.storageB}
        />,
        el
      );
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
      this.alertIndicatorB.endBroadcast();
      this.storageB.endBroadcast();
      storageResources$.destroy();
    };
  }
};

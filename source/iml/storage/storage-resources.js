// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { type State } from './storage-reducer.js';

import flatMapChanges from '@iml/flat-map-changes';
import socketStream from '../socket/socket-stream.js';
import highland from 'highland';

import { filterSame } from '../api-transforms.js';
import { flow } from '@iml/fp';
import { addStorageResources, setStorageTableLoading } from './storage-actions.js';

import store from '../store/get-store.js';

export default () => {
  const s = store.select('storage').filter(filterSame((x: State) => x.config));

  return flatMapChanges((x: State) => {
    // $FlowFixMe: This will never be null
    const r = x.resourceClasses[x.config.selectIndex];

    if (r == null) return highland([{ objects: [] }]);

    type Params = {
      qs: { offset: number, limit: number, order_by?: string }
    };

    const params: Params = {
      qs: {
        offset: x.config.offset,
        limit: x.config.entries
      }
    };

    if (x.config.sortKey !== '') params.qs.order_by = `${x.config.sortDesc ? '-' : ''}attr_${x.config.sortKey}`;

    return socketStream(`/api/storage_resource/${r.plugin_name}/${r.class_name}/`, params);
  }, s)
    .tap(() => store.dispatch(setStorageTableLoading(false)))
    .tap(
      flow(
        addStorageResources,
        store.dispatch
      )
    );
};

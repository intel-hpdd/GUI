// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';
import type { Column, Attribute, StorageResourceClass, StorageResourceResponse } from './storage-types.js';

import store from '../store/get-store.js';
import { UI_ROOT } from '../environment.js';
import { entries } from '@iml/obj';
import Inferno, { linkEvent } from 'inferno';
import AlertIndicator from '../alert-indicator/alert-indicator.js';
import extractApiId from '@iml/extract-api';
import { TableInfo, EntriesDropdown, Pager } from '../pagination-components.js';
import { setStorageConfig } from './storage-actions.js';

type SortedAttribute = {
  ...Attribute,
  key: string
};

const sortedAttributes = (columns: Column[], attributes: { [string]: Attribute }): SortedAttribute[] =>
  (entries(attributes): Array<[string, Attribute]>).reduce((arr, [key, v]) => {
    const index = columns.findIndex(c => c.name === key);

    arr[index] = {
      ...v,
      key
    };

    return arr;
  }, []);

export const StorageAttribute = ({ attribute }: { attribute: SortedAttribute }) => {
  if (attribute.class === 'ResourceReference') {
    if (!attribute.raw) return;

    const id = extractApiId(attribute.raw);
    return <a href={`${UI_ROOT}configure/storage/${id}`} dangerouslySetInnerHTML={{ __html: attribute.markup }} />;
  } else {
    return <span dangerouslySetInnerHTML={{ __html: attribute.markup }} />;
  }
};

const handleSort = ([sortKey: string, sortDesc: boolean]) => {
  store.dispatch(setStorageConfig({ sortKey, sortDesc: !sortDesc, loading: true }));
};

const setEntries = entries => {
  store.dispatch(setStorageConfig({ entries, loading: true }));
};

const setOffset = offset => {
  store.dispatch(setStorageConfig({ offset, loading: true }));
};

const ascDesc = (name, sortKey, sortDesc) => {
  if (name !== sortKey) return '';

  return sortDesc ? 'fa-sort-desc' : 'fa-sort-asc';
};

export const ResourceTable = ({
  resourceClass,
  resources,
  alertIndicatorB,
  sortKey,
  sortDesc,
  entries
}: {
  resourceClass: StorageResourceClass,
  resources: StorageResourceResponse,
  alertIndicatorB: () => HighlandStreamT<any>,
  sortKey: string,
  sortDesc: boolean,
  entries: number
}) => {
  const columns = resourceClass.columns;

  const objects = resources.objects;

  if (objects.length === 0)
    return (
      <div class="well text-center resource-table-no-records">
        <h1>No records found</h1>
      </div>
    );

  const objectWithAttributes = objects.map(x => ({
    ...x,
    sortedAttributes: sortedAttributes(columns, x.attributes)
  }));

  return (
    <div class="resource-table">
      <div style={{ 'margin-bottom': '25px' }}>
        <EntriesDropdown entries={entries} setEntries={setEntries} />
      </div>
      <table class="table">
        <tr>
          <th>Name</th>
          <th>Alerts</th>
          {columns.map(c => (
            <th key={c.name}>
              <a onClick={linkEvent([c.name, sortDesc], handleSort)}>
                {c.label}
                <i className={`fa ${ascDesc(c.name, sortKey, sortDesc)}`} />
              </a>
            </th>
          ))}
        </tr>
        <tbody>
          {objectWithAttributes.map(x => (
            <tr>
              <td>
                <a href={`${UI_ROOT}configure/storage/${x.id}`}>{x.alias}</a>
              </td>
              <td>
                <AlertIndicator viewer={alertIndicatorB} size="medium" recordId={x.id} />
              </td>
              {x.sortedAttributes.map(v => (
                <td key={v.key}>
                  <StorageAttribute attribute={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div class="text-center">
        <Pager meta={resources.meta} setOffset={setOffset} />
      </div>
      <div class="text-center" style={{ color: '#999' }}>
        <TableInfo meta={resources.meta} />
      </div>
    </div>
  );
};

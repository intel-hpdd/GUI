// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Meta } from '../api-types.js';

export type Column = {
  label: string,
  name: string
};

export type Field = {
  class: string,
  label: string,
  name: string,
  optional: boolean,
  user_read_only: boolean
};

export type StorageResourceClass = {
  id: number,
  plugin_internal: boolean,
  plugin_name: string,
  resource_uri: string,
  user_creatable: boolean,
  label: string,
  class_name: string,
  columns: Column[],
  fields: Field[]
};

type Chart = {|
  series: string[],
  title: string
|};

export type TimeseriesChart = {|
  type: 'timeseries',
  title: string,
  series: TimeseriesStats[]
|};

export type HistogramChart = {|
  type: 'histogram',
  title: string,
  series: HistogramStats[]
|};

export type HistogramData = {|
  bin_labels: string[],
  values: number[]
|};

export type HistogramStats = {|
  label: string,
  name: string,
  type: 'histogram',
  data: HistogramData,
  unit_name: string
|};

export type TimeseriesStats = {|
  label: string,
  name: string,
  type: 'timeseries',
  data: null,
  unit_name: string
|};

export type Stats = HistogramStats | TimeseriesStats;

export type Attribute = {
  class: string,
  label: string,
  markup: string,
  raw: any
};

export type StorageResource = {
  alerts: Object[],
  alias: string,
  attributes: {
    [string]: Attribute
  },
  charts: Chart[],
  class_name: string,
  default_alias: string,
  deletable: boolean,
  id: number,
  parent_classes: ?(string[]),
  plugin_name: string,
  propagated_alerts: Object[],
  resource_uri: string,
  stats: {
    [string]: Stats
  },
  storage_id_str: string
};

export type StorageResourceResponse = {
  meta: Meta,
  objects: StorageResource[]
};

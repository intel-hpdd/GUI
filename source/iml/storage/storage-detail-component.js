// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import type { HighlandStreamT } from 'highland';
import type {
  StorageResource,
  TimeseriesChart,
  HistogramChart,
  Stats
} from './storage-types.js';

import { values } from '@iml/obj';
import { asValue } from '../as-value/as-value.js';
import { StorageAttribute } from './resource-table.js';

import AlertIndicator from '../alert-indicator/alert-indicator.js';
import StorageResourceHistogram from './storage-resource-histogram.js';
import StorageResourceTimeSeries from './storage-resource-time-series.js';

const buildCharts = (
  x: StorageResource
): (TimeseriesChart | HistogramChart)[] =>
  x.charts.map(c => {
    const series: Stats[] = c.series.map(s => x.stats[s]).filter(Boolean);
    const type: 'histogram' | 'timeseries' = series
      .map(x => x.type)
      .reduce((x, y) => (x === 'histogram' ? 'histogram' : y));

    return ({
      title: c.title,
      type,
      series
    }: any);
  });

export const StorageDetail = asValue(
  'resource',
  ({
    resource,
    alertIndicatorB
  }: {
    resource: StorageResource,
    alertIndicatorB: () => HighlandStreamT<any>
  }) => {
    return (
      <div class="container container-full container">
        <div class="detail-panel">
          <h4 class="section-header">
            {resource.class_name} Detail
          </h4>
          {values(resource.attributes).map(x =>
            <div class="detail-row">
              <div>
                {x.label}:
              </div>
              <div>
                <StorageAttribute attribute={x} />
              </div>
            </div>
          )}
          <div class="detail-row">
            <div>Alerts:</div>
            <div>
              <AlertIndicator
                viewer={alertIndicatorB}
                size="medium"
                recordId={resource.id}
              />
            </div>
          </div>
        </div>
        <div>
          {buildCharts(resource).map(c =>
            <div>
              <h4 class="text-center" style={{ 'margin-top': '50px' }}>
                {c.title}
              </h4>
              {c.type === 'histogram'
                ? <StorageResourceHistogram chart={c} />
                : <StorageResourceTimeSeries
                    chart={c}
                    resourceUri={resource.resource_uri}
                  />}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default {
  bindings: { storageResource$: '<', alertIndicatorB: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(
        <StorageDetail
          stream={this.storageResource$}
          alertIndicatorB={this.alertIndicatorB}
        />,
        el
      );
    };

    this.$onDestroy = () => {
      this.storageResource$.destroy();
      Inferno.render(null, el);
    };
  }
};

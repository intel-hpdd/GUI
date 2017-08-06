// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import type { HighlandStreamT } from 'highland';
import type { StorageResource, Stats } from './storage-types.js';
import type { Point } from '../api-types.js';
import { values } from '@iml/obj';
import { asValue } from '../as-value/as-value.js';
import { StorageAttribute } from './resource-table.js';
import highland from 'highland';
import AlertIndicator from '../alert-indicator/alert-indicator.js';
import socketStream from '../socket/socket-stream.js';
import Component from 'inferno-component';
import { getTimeParams } from '../charting/get-time-params.js';
import bufferDataNewerThan from '../charting/buffer-data-newer-than.js';
import getLine from '../charting/types/line/get-line.js';
import { getLegendFactory } from '../charting/types/legend/get-legend.js';
import d3 from 'd3';
import debounce from '@iml/debounce';
import { cloneChildren } from '../inferno-utils.js';

const getLegend = getLegendFactory();

type Charts = {
  type: 'timeseries' | 'histogram',
  title: string,
  series: Stats[]
};

type ChartProps = {
  onDimensionChange: Function,
  margins: {
    top: number,
    right: number,
    bottom: number,
    left: number
  },
  children: React$Element<*>
};

class Charted extends Component {
  state = {};
  debounced: Function;
  componentWillMount() {
    const onResize = () => {
      const rect = this.state.svg.getBoundingClientRect();

      this.setState({
        ...this.state,
        dimensions: {
          usableWidth: this.getWidth(rect),
          usableHeight: this.getHeight(rect)
        }
      });
    };

    this.debounced = debounce(onResize, 100);

    window.addEventListener('resize', this.debounced);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.debounced, false);
  }
  getHeight({ height }) {
    return height - this.props.margins.top - this.props.margins.bottom;
  }
  getWidth({ width }) {
    return width - this.props.margins.left - this.props.margins.right;
  }
  gotComponent(svg) {
    if (this.state.svg != null) return;

    const rect = svg.getBoundingClientRect();

    this.setState({
      svg,
      dimensions: {
        usableWidth: this.getWidth(rect),
        usableHeight: this.getHeight(rect)
      }
    });
  }
  render() {
    return (
      <svg
        ref={el => {
          this.gotComponent(el);
        }}
        class="charting"
        style={{ width: '100%', height: '100%' }}
      >
        <g
          class="charting-group"
          transform={`translate(${this.props.margins.left},${this.props.margins
            .top})`}
        >
          {(() => {
            if (this.state.svg) {
              const svg = d3.select(this.state.svg).datum(this.props.points);
              const chartingGroup = svg.select('.charting-group');

              return cloneChildren(this.props.children, () => ({
                points: this.props.points,
                margins: this.props.margins,
                dimensions: this.state.dimensions,
                chartingGroup,
                svg
              }));
            } else {
              return null;
            }
          })()}
        </g>
      </svg>
    );
  }
}

class Scales extends Component {
  xScale: Object;
  yScale: Object;
  componentWillMount() {
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();
    // this.colors = d3.scale
    //   .category20b()
    //   .domain(this.props.chart.series.map(x => x.label));
  }
  render() {
    const getX = (x: Point) => new Date(x.ts);

    this.xScale
      .domain(d3.extent(this.props.points, getX))
      .range([0, this.props.dimensions.usableWidth]);

    this.yScale
      .domain([
        0,
        d3.max(this.props.points, (x: Point): number =>
          Math.max(...values(x.data))
        )
      ])
      .range([this.props.dimensions.usableHeight - 20, 0]);

    return (
      <g>
        {cloneChildren(this.props.children, () => ({
          ...this.props,
          yScale: this.yScale,
          xScale: this.xScale
        }))}
      </g>
    );
  }
}

type AxisProps = {
  chartingGroup: Object,
  type: 'x' | 'y',
  xScale?: Object,
  yScale?: Object,
  dimensions: {
    usableHeight: number,
    usableWidth: number
  }
};

class Axis extends Component {
  props: AxisProps;
  axis: Object;
  componentWillMount() {
    this.axis = d3.svg
      .axis()
      .orient(this.props.type === 'x' ? 'bottom' : 'left')
      .scale(this.props.type === 'x' ? this.props.xScale : this.props.yScale);

    this.props.chartingGroup
      .append('g')
      .classed(`axis ${this.props.type}-axis`, true);
  }
  componentWillUnmount() {
    this.props.chartingGroup.select(`.${this.props.type}-axis`).remove();
  }
  render() {
    this.props.chartingGroup
      .select(`.${this.props.type}-axis`)
      .call(
        x =>
          this.props.type === 'x'
            ? x.attr(
                'transform',
                `translate(0,${this.props.dimensions.usableHeight - 20})`
              )
            : x
      )
      .call(this.axis);
  }
}

type LineProps = {
  chartingGroup: Object,
  xScale: Object,
  yScale: Object,
  color: Function,
  xValue: Function,
  xComparator: Function,
  yValue: Function
};

class Line extends Component {
  props: LineProps;
  line: Object;
  componentWillMount() {
    this.line = getLine();
  }
  render() {
    this.line
      .color(this.props.color)
      .xScale(this.props.xScale)
      .yScale(this.props.yScale)
      .xValue(this.props.xValue)
      .xComparator(this.props.xComparator)
      .yValue(this.props.yValue);

    this.props.chartingGroup.transition().duration(0).call(this.line);
  }
}

class Legend extends Component {
  legend: Object;
  componentWillMount() {
    this.legend = getLegend().showLabels(true).height(20).padding(20);

    this.props.svg
      .append('g')
      .classed(`legend`, true)
      .call(
        x =>
          this.props.transform != null
            ? x.attr('transform', this.props.transform)
            : x
      );
  }
  render() {
    this.legend
      .colors(this.props.colors)
      .width(this.props.dimensions.usableWidth);

    this.props.svg.select('.legend').call(this.legend);
  }
}

type StorageResourceTimeSeriesState = {
  data: Point[]
};

class StorageResourceTimeSeries extends Component {
  stream: HighlandStreamT<Point[]>;
  props: { resourceUri: string, chart: Charts };
  state: StorageResourceTimeSeriesState = {
    data: []
  };
  componentWillMount() {
    const metrics = this.props.chart.series.map(s => s.name).join(',');

    const d = [10, 'minutes'];
    const duration = getTimeParams.getRequestDuration({})(...d);
    const buff = bufferDataNewerThan(...d);

    this.stream = highland((push, next) => {
      socketStream(
        `${this.props.resourceUri}metric/`,
        duration({
          qs: {
            metrics
          }
        }),
        true
      )
        .flatten()
        .through(buff)
        .collect()
        .each(x => {
          push(null, x);
          next();
        });
    })
      .ratelimit(1, 10000)
      .each(data =>
        this.setState({
          data
        })
      );
  }
  componentWillUnmount() {
    this.stream.destroy();
  }
  render() {
    const getX = (x: Point) => new Date(x.ts);
    const colors = d3.scale
      .category20b()
      .domain(this.props.chart.series.map(x => x.name));

    return (
      <div
        class="storage-detail-chart"
        style={{ height: '500px', display: 'flex' }}
      >
        <div style={{ flex: '0 0 24px', display: 'flex' }}>
          <h5
            style={{
              transform: 'rotate(270deg)',
              'align-self': 'center',
              width: '24px'
            }}
          >
            {this.props.chart.series.map(x => x.unit_name).join(', ')}
          </h5>
        </div>
        <div style={{ flex: '1' }}>
          <Charted
            points={this.state.data}
            margins={{
              top: 50,
              right: 30,
              bottom: 30,
              left: 50
            }}
          >
            <Scales>
              <Legend colors={colors} transform="translate(50,0)" />
              <Axis type="x" />
              <Axis type="y" />
              {this.props.chart.series.map(x =>
                <Line
                  color={() => colors(x.name)}
                  xValue={(x: Point) => new Date(x.ts)}
                  yValue={p => p.data[x.name]}
                  xComparator={(x, y) =>
                    getX(x).getTime() === getX(y).getTime()}
                />
              )}
            </Scales>
          </Charted>
        </div>
      </div>
    );
  }
}

const buildCharts = (x: StorageResource) =>
  x.charts.map(c => {
    const chart = {
      type: 'timeseries',
      title: c.title,
      series: []
    };

    return c.series.reduce((prev, name) => {
      const stat = x.stats[name];

      if (!stat) return prev;

      return {
        ...prev,
        type: stat.type === 'histogram' ? stat.type : prev.type,
        series: [...prev.series, stat]
      };
    }, chart);
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
              <StorageResourceTimeSeries
                chart={c}
                resourceUri={resource.resource_uri}
              />
            </div>
          )}
          <pre>
            {JSON.stringify(buildCharts(resource), null, 2)}
          </pre>
        </div>
        <pre>
          {JSON.stringify(resource, null, 2)}
        </pre>
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

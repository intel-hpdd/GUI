// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';
import type { TimeseriesChart } from './storage-types.js';
import type { Point } from '../api-types.js';

import highland from 'highland';
import Chart from '../charting/chart.js';
import Axis from '../charting/axis.js';
import Line from '../charting/line.js';
import Legend from '../charting/legend.js';
import Inferno from 'inferno';
import Component from 'inferno-component';
import d3 from 'd3';
import socketStream from '../socket/socket-stream.js';

import bufferDataNewerThan from '../charting/buffer-data-newer-than.js';

import { getTimeParams } from '../charting/get-time-params.js';
import { values } from '@iml/obj';
import { cloneChildren } from '../inferno-utils.js';
import { uniqBy } from '@iml/fp';

const NoData = props => (
  <div
    style={{
      height: '500px',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center'
    }}
  >
    <h3>{props.message}</h3>
  </div>
);

class Scales extends Component {
  xScale: Object;
  yScale: Object;
  componentWillMount() {
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();
  }
  render() {
    const getX = (x: Point) => new Date(x.ts);

    this.xScale.domain(d3.extent(this.props.points, getX)).range([0, this.props.dimensions.usableWidth]);

    this.yScale
      .domain([0, d3.max(this.props.points, (x: Point): number => Math.max(...values(x.data)))])
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

export default class StorageResourceTimeSeries extends Component {
  stream: HighlandStreamT<Point[]>;
  props: { resourceUri: string, chart: TimeseriesChart };
  state: { data: ?(Point[]) } = {
    data: null
  };
  componentWillMount() {
    const metrics = this.props.chart.series.map(s => s.name).join(',');

    const d = [10, 'minutes'];
    const duration = getTimeParams.getRequestDuration({})(...d);
    const buff = bufferDataNewerThan(...d);

    this.stream = (highland((push, next) => {
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
        .each((xs: Point[]) => {
          push(null, xs);
          next();
        });
    })
      .ratelimit(1, 10000)
      .each((data: Point[]) =>
        this.setState({
          data
        })
      ): any);
  }
  componentWillUnmount() {
    this.stream.destroy();
  }
  render() {
    if (this.state.data == null) return <NoData message="Fetching Data..." />;

    if (this.state.data.length === 0) return <NoData message="No Data Available." />;

    const { data } = this.state;

    const getX = (x: Point) => new Date(x.ts);
    const colors = d3.scale.category10().domain(this.props.chart.series.map(x => x.name).reverse());

    return (
      <div class="storage-detail-chart" style={{ height: '500px', display: 'flex' }}>
        <div style={{ flex: '0 0 24px', display: 'flex' }}>
          <h5
            style={{
              transform: 'rotate(270deg)',
              'align-self': 'center',
              width: '24px'
            }}
          >
            {uniqBy(x => x)(this.props.chart.series.map(x => x.unit_name)).join(', ')}
          </h5>
        </div>
        <div style={{ flex: '1' }}>
          <Chart
            points={data}
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
              {this.props.chart.series.map(x => (
                <Line
                  color={() => colors(x.name)}
                  xValue={(x: Point) => new Date(x.ts)}
                  yValue={p => p.data[x.name]}
                  xComparator={(x, y) => getX(x).getTime() === getX(y).getTime()}
                />
              ))}
            </Scales>
          </Chart>
        </div>
      </div>
    );
  }
}

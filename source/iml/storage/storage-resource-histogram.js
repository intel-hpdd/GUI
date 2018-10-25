// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Point } from "../api-types.js";
import type { HistogramChart, HistogramStats } from "./storage-types.js";

import { Component } from "inferno";
import d3 from "d3";
import Chart from "../charting/chart.js";
import Axis from "../charting/axis.js";
import Legend from "../charting/legend.js";
import Area from "../charting/area.js";

import { cloneChildren } from "../inferno-utils.js";
import { zipBy } from "@iml/fp";
import { values } from "@iml/obj";

type ReducedHistogram = {
  data: {
    [string]: number
  },
  bin: string
};

const getHistogramSeries = (xs: HistogramStats[]) =>
  xs
    .map(
      ({ data: { bin_labels: binLabels, values }, name }): ReducedHistogram[] =>
        zipBy((l, r) => ({ bin: l, data: { [name]: r } }))(binLabels)(values)
    )
    .reduce((xs, ys) =>
      xs.map((x, i) => ({
        ...x,
        data: {
          ...x.data,
          ...ys[i].data
        }
      }))
    );

class HistogramScales extends Component {
  xScale: Object;
  yScale: Object;
  componentWillMount() {
    this.xScale = d3.scale.ordinal();
    this.yScale = d3.scale.linear();
  }
  render() {
    this.xScale.domain(this.props.points.map(p => p.bin)).rangePoints([0, this.props.dimensions.usableWidth]);

    this.yScale
      .domain([0, d3.max(this.props.points, (x: Point): number => Math.max(...values(x.data))) + 100])
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

const Areas = props => {
  return (
    <>
      {props.chart.series.map(x => (
        <Area
          interpolate="cardinal"
          color={() => props.colors(x.name)}
          xValue={x => x.bin}
          y1Value={p => p.data[x.name]}
          {...props}
        />
      ))}
    </>
  );
};

export default class StorageResourceHistogram extends Component {
  props: { chart: HistogramChart };
  render() {
    const colors = d3.scale.category10().domain(this.props.chart.series.map(x => x.name));

    return (
      <div class="storage-detail-chart" style={{ height: "500px" }}>
        <Chart
          points={getHistogramSeries(this.props.chart.series)}
          margins={{
            top: 50,
            right: 30,
            bottom: 30,
            left: 50
          }}
        >
          <HistogramScales>
            <Legend colors={colors} transform="translate(50,0)" />
            <Axis type="x" />
            <Axis type="y" />
            <Areas {...this.props} colors={colors} />
          </HistogramScales>
        </Chart>
      </div>
    );
  }
}

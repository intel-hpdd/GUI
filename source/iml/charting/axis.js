// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import d3 from "d3";

type AxisProps = {
  chartingGroup?: Object,
  type: "x" | "y",
  xScale?: Object,
  yScale?: Object,
  dimensions?: {
    usableHeight: number,
    usableWidth: number
  }
};

export default class Axis extends Component {
  props: AxisProps;
  axis: Object;
  componentWillMount() {
    if (this.props.dimensions == null) throw new Error("props.dimensions missing.");
    if (this.props.chartingGroup == null) throw new Error("props.chartingGroup missing.");

    const { dimensions, chartingGroup } = this.props;

    this.axis = d3.svg
      .axis()
      .orient(this.props.type === "x" ? "bottom" : "left")
      .scale(this.props.type === "x" ? this.props.xScale : this.props.yScale);

    chartingGroup
      .append("g")
      .classed(`axis ${this.props.type}-axis`, true)
      .call(x => (this.props.type === "x" ? x.attr("transform", `translate(0,${dimensions.usableHeight - 20})`) : x));
  }
  componentWillUnmount() {
    if (this.props.chartingGroup == null) return;
    this.props.chartingGroup.select(`.${this.props.type}-axis`).remove();
  }
  render() {
    if (this.props.chartingGroup == null) return;
    this.props.chartingGroup.select(`.${this.props.type}-axis`).call(this.axis);
  }
}

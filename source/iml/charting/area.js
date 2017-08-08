// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';
import d3 from 'd3';
import { flow } from '@iml/fp';

let counter = 0;

export default class Area extends Component {
  count: number;
  componentWillMount() {
    this.count = counter += 1;

    this.props.chartingGroup
      .append('g')
      .append('svg:path')
      .classed(`area area${this.count}`, true);
  }
  render() {
    const area = d3.svg
      .area()
      .interpolate('cardinal')
      .x(flow(this.props.xValue, this.props.xScale))
      .y0(this.props.yScale.range()[0])
      .y1(flow(this.props.y1Value, this.props.yScale));

    this.props.chartingGroup
      .select(`.area${this.count}`)
      .attr('stroke', this.props.color)
      .attr('fill', this.props.color)
      .attr('fill-opacity', '0.2')
      .attr('d', area);
  }
}

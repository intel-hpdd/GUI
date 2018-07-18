// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getLine from '../charting/types/line/get-line.js';
import Inferno from 'inferno';
import Component from 'inferno-component';

type LineProps = {
  chartingGroup?: Object,
  interpolate?: string,
  xScale?: Object,
  yScale?: Object,
  color: Function,
  xValue: Function,
  xComparator: Function,
  yValue: Function
};

export default class Line extends Component {
  props: LineProps;
  line: Object;
  componentWillMount() {
    this.line = getLine();
  }
  render() {
    if (!this.props.chartingGroup) return;

    const { chartingGroup } = this.props;

    this.line
      .interpolate(this.props.interpolate || 'linear')
      .color(this.props.color)
      .xScale(this.props.xScale)
      .yScale(this.props.yScale)
      .xValue(this.props.xValue)
      .xComparator(this.props.xComparator)
      .yValue(this.props.yValue);

    chartingGroup
      .transition()
      .duration(0)
      .call(this.line);
  }
}

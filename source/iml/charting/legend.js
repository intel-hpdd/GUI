// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';

import { getLegendFactory } from '../charting/types/legend/get-legend.js';

const getLegend = getLegendFactory();

export default class Legend extends Component {
  legend: Object;
  componentWillMount() {
    // $FlowFixMe: Flow isn't smart enough disambiguate return types
    this.legend = getLegend()
      .showLabels(true)
      .height(20)
      .padding(20);

    this.props.svg
      .append('g')
      .classed(`legend`, true)
      .call(x => (this.props.transform != null ? x.attr('transform', this.props.transform) : x));
  }
  render() {
    this.legend.colors(this.props.colors).width(this.props.dimensions.usableWidth);

    this.props.svg.select('.legend').call(this.legend);
  }
}

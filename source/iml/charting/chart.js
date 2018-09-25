// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";
import Component from "inferno-component";
import debounce from "@iml/debounce";
import d3 from "d3";
import global from "../global.js";

import { cloneChildren } from "../inferno-utils.js";

type ChartProps<P> = {
  margins: {
    top: number,
    right: number,
    bottom: number,
    left: number
  },
  points: P[],
  children: React$Element<*>
};

type ChartState = {
  svg?: HTMLElement,
  dimensions?: {
    usableWidth: number,
    usableHeight: number
  }
};

export default class Chart extends Component {
  state: ChartState = {};
  props: ChartProps<*>;
  debounced: Function;
  componentWillMount() {
    const onResize = () => {
      if (!this.state.svg) return;

      const rect = this.state.svg.getBoundingClientRect();

      this.setState({
        ...this.state,
        dimensions: this.getDimensions(rect)
      });
    };

    this.debounced = debounce(onResize, 100);

    global.addEventListener("resize", this.debounced);
  }
  componentWillUnmount() {
    global.removeEventListener("resize", this.debounced, false);
  }
  getDimensions({ width, height }: { width: number, height: number }) {
    return {
      usableWidth: width - this.props.margins.left - this.props.margins.right,
      usableHeight: height - this.props.margins.top - this.props.margins.bottom
    };
  }
  gotComponent(svg: HTMLElement) {
    if (this.state.svg != null) return;

    const rect = svg.getBoundingClientRect();

    this.setState({
      svg,
      dimensions: this.getDimensions(rect)
    });
  }
  render() {
    return (
      <svg
        ref={el => {
          this.gotComponent(el);
        }}
        class="charting"
        style={{ width: "100%", height: "100%" }}
      >
        <g class="charting-group" transform={`translate(${this.props.margins.left},${this.props.margins.top})`}>
          {(() => {
            if (this.state.svg) {
              const svg = d3.select(this.state.svg).datum(this.props.points);
              const chartingGroup = svg.select(".charting-group");

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

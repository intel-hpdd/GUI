// @flow

import { render } from "inferno";

import Axis from "../../../../source/iml/charting/axis.js";
import d3 from "d3";

describe("axis", () => {
  let svg, chartingGroup;

  beforeEach(() => {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chartingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(chartingGroup);
  });

  it("should render x as expected", () => {
    render(
      <Axis
        type="x"
        xScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([0, 200])}
        dimensions={{ usableWidth: 200, usableHeight: 200 }}
        chartingGroup={d3.select(chartingGroup).datum([0, 100])}
      />,
      svg
    );

    expect(svg).toMatchSnapshot();
  });

  it("should render y as expected", () => {
    render(
      <Axis
        type="y"
        yScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([0, 200])}
        dimensions={{ usableWidth: 200, usableHeight: 200 }}
        chartingGroup={d3.select(chartingGroup).datum([0, 100])}
      />,
      svg
    );

    expect(svg).toMatchSnapshot();

    render(null, svg);
  });

  it("should throw when props are missing", () => {
    expect.assertions(2);

    expect(() =>
      render(
        <Axis
          type="y"
          yScale={d3.scale
            .linear()
            .domain([0, 100])
            .range([0, 200])}
          chartingGroup={d3.select(chartingGroup).datum([0, 100])}
        />,
        svg
      )
    ).toThrow();

    expect(() =>
      render(
        <Axis
          type="y"
          yScale={d3.scale
            .linear()
            .domain([0, 100])
            .range([0, 200])}
          dimensions={{ usableWidth: 200, usableHeight: 200 }}
        />,
        svg
      )
    ).toThrow();
  });

  it("should skip cleanup", () => {
    render(
      <Axis
        type="y"
        yScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([0, 200])}
        dimensions={{ usableWidth: 200, usableHeight: 200 }}
        chartingGroup={d3.select(chartingGroup).datum([0, 100])}
      />,
      svg
    );

    render(
      <Axis
        type="y"
        yScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([0, 200])}
        dimensions={{ usableWidth: 200, usableHeight: 200 }}
      />,
      svg
    );

    render(null, svg);
  });
});

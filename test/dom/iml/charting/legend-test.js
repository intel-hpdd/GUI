// @flow

import Inferno from "inferno";

import Legend from "../../../../source/iml/charting/legend.js";
import d3 from "d3";

it("should render as expected", () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  Inferno.render(
    <Legend
      svg={d3.select(svg).datum([0, 100])}
      dimensions={{ usableWidth: 200, usableHeight: 200 }}
      colors={d3.scale
        .ordinal()
        .domain(["foo", "bar"])
        .range(["green", "blue"])}
    />,
    svg
  );

  expect(svg).toMatchSnapshot();
});

it("should transform", () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  Inferno.render(
    <Legend
      svg={d3.select(svg).datum([0, 100])}
      dimensions={{ usableWidth: 200, usableHeight: 200 }}
      transform="translate(0,100)"
      colors={d3.scale
        .ordinal()
        .domain(["foo", "bar"])
        .range(["green", "blue"])}
    />,
    svg
  );

  expect(svg).toMatchSnapshot();
});

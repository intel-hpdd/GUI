// @flow

import Inferno from "inferno";

import Line from "../../../../source/iml/charting/line.js";
import d3 from "d3";

describe("line tests", () => {
  let svg, chartingGroup;

  beforeEach(() => {
    // $FlowFixMe: Mock for test
    Element.prototype.getTotalLength = () => 100;

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chartingGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.appendChild(chartingGroup);
  });

  afterEach(() => {
    // $FlowFixMe: Mock for test
    delete Element.prototype.getTotalLength;
  });

  it("should render as expected", () => {
    Inferno.render(
      <Line
        xScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([0, 200])}
        yScale={d3.scale
          .linear()
          .domain([0, 100])
          .range([200, 0])}
        xValue={x => x}
        yValue={x => x}
        xComparator={(x, y) => x === y}
        chartingGroup={d3.select(chartingGroup).datum([0, 100])}
        color={() => "green"}
      />,
      svg
    );

    expect(svg).toMatchSnapshot();
  });
});

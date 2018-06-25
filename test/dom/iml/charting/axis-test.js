// @flow

import Inferno from 'inferno';

import Axis from '../../../../source/iml/charting/axis.js';
import d3 from 'd3';

describe('axis', () => {
  let svg, chartingGroup;

  beforeEach(() => {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chartingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(chartingGroup);
  });

  it('should render x as expected', () => {
    Inferno.render(
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

  it('should render y as expected', () => {
    Inferno.render(
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

    Inferno.render(null, svg);
  });

  it('should throw when props are missing', () => {
    expect.assertions(2);

    expect(() =>
      Inferno.render(
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
      Inferno.render(
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

  it('should skip cleanup', () => {
    Inferno.render(
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

    Inferno.render(
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

    Inferno.render(null, svg);
  });
});

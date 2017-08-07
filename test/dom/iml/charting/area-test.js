// @flow

import Inferno from 'inferno';

import Area from '../../../../source/iml/charting/area.js';
import d3 from 'd3';

it('should render as expected', () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const chartingGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  svg.appendChild(chartingGroup);

  Inferno.render(
    <Area
      xScale={d3.scale.linear().domain([0, 100]).range([0, 200])}
      yScale={d3.scale.linear().domain([0, 100]).range([200, 0])}
      xValue={x => x}
      y1Value={x => x}
      chartingGroup={d3.select(chartingGroup).datum([0, 100])}
      color={'green'}
    />,
    svg
  );

  expect(svg).toMatchSnapshot();
});

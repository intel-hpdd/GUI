import _ from '@mfl/lodash-mixins';
import getHeatMapLegend from '../../../../source/iml/heat-map/get-heat-map-legend.js';
import d3 from 'd3';

describe('the heat map legend', () => {
  let heatMapLegend;

  beforeEach(() => {
    heatMapLegend = getHeatMapLegend();
  });

  it('should be callable', () => {
    expect(heatMapLegend).toEqual(expect.any(Function));
  });

  it('should set destroy to a noop', () => {
    expect(heatMapLegend.destroy).toEqual(jasmine.any(Function));
  });

  const accessors = [
    'colorScale',
    'legendScale',
    'zScale',
    'formatter',
    'width',
    'height',
    'margin'
  ];
  accessors.forEach(accessor => {
    it('should have a ' + accessor + 'accessor', () => {
      expect(heatMapLegend[accessor]).toEqual(expect.any(Function));
    });

    it('should set ' + accessor, () => {
      const val = { foo: 'bar' };
      heatMapLegend[accessor](val);
      expect(heatMapLegend[accessor]()).toBe(val);
    });
  });

  describe('when populated', () => {
    let svg, heatMapLegendGroup, selection, setup, query, queryAll;

    beforeEach(() => {
      HTMLElement.prototype.getBBox = () => ({
        height: 100,
        width: 100,
        x: 0,
        y: 0
      });

      heatMapLegendGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );

      selection = d3.select(heatMapLegendGroup);
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      document.body.appendChild(svg);
      svg.appendChild(heatMapLegendGroup);
      query = heatMapLegendGroup.querySelector.bind(heatMapLegendGroup);
      queryAll = heatMapLegendGroup.querySelectorAll.bind(heatMapLegendGroup);

      const colors = ['#8ebad9', '#d6e2f3', '#fbb4b4', '#fb8181', '#ff6262'];
      const color = d3.scale
        .linear()
        .range(colors)
        .domain(d3.range(0, 1, 1.0 / (colors.length - 1)).concat(1));

      const legend = d3.scale.linear().domain([0, 99]).range([0, 1]);
      heatMapLegend
        .width(500)
        .height(30)
        .margin({ top: 5, right: 0, bottom: 5, left: 0 })
        .colorScale(color)
        .legendScale(legend)
        .zScale(d3.scale.linear().range([0, 1]))
        .formatter(_.identity);

      const zValue = _.pluckPath('data.stats_read_bytes');
      setup = function setup(d) {
        const merged = _.flatten(d);
        heatMapLegend.zScale().domain(d3.extent(merged, zValue));
        selection.datum(d).call(heatMapLegend);
      };
    });

    afterEach(() => {
      document.body.removeChild(svg);
      delete HTMLElement.prototype.getBBox;
    });

    describe('with multiple data points', () => {
      beforeEach(() => {
        setup([
          [
            {
              data: { stats_read_bytes: 8091667852.6 },
              ts: '2015-05-11T11:44:10+00:00',
              id: '3'
            },
            {
              data: { stats_read_bytes: 9357931867.8 },
              ts: '2015-05-11T11:44:20+00:00',
              id: '3'
            }
          ]
        ]);
      });

      it('should have 100 steps', () => {
        expect(queryAll('.step').length).toBe(100);
      });

      it('should set the min text', () => {
        expect(Math.floor(query('.min').innerHTML)).toEqual(8091667852);
      });

      it('should set the max text', () => {
        expect(Math.floor(query('.max').innerHTML)).toEqual(9357931867);
      });
    });
  });
});

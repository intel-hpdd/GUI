import _ from '@mfl/lodash-mixins';

describe('the heat map legend', function() {
  'use strict';
  beforeEach(module('heatMap'));

  let getHeatMapLegend, heatMapLegend;

  beforeEach(
    inject(function(_getHeatMapLegend_) {
      getHeatMapLegend = _getHeatMapLegend_;

      heatMapLegend = getHeatMapLegend();
    })
  );

  it('should be callable', function() {
    expect(heatMapLegend).toEqual(jasmine.any(Function));
  });

  it('should set destroy to a noop', function() {
    expect(heatMapLegend.destroy).toBe(_.noop);
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

  accessors.forEach(function(accessor) {
    it('should have a ' + accessor + 'accessor', function() {
      expect(heatMapLegend[accessor]).toEqual(jasmine.any(Function));
    });

    it('should set ' + accessor, function() {
      const val = { foo: 'bar' };

      heatMapLegend[accessor](val);

      expect(heatMapLegend[accessor]()).toBe(val);
    });
  });

  describe('when populated', function() {
    let d3, svg, heatMapLegendGroup, selection, setup, query, queryAll;

    beforeEach(
      inject(function(_d3_) {
        d3 = _d3_;

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
          .margin({
            top: 5,
            right: 0,
            bottom: 5,
            left: 0
          })
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
      })
    );

    afterEach(function() {
      document.body.removeChild(svg);
    });

    describe('with multiple data points', function() {
      beforeEach(function() {
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

      it('should have 100 steps', function() {
        expect(queryAll('.step').length).toBe(100);
      });

      it('should set the min text', function() {
        expect(Math.floor(query('.min').innerHTML)).toEqual(8091667852);
      });

      it('should set the max text', function() {
        expect(Math.floor(query('.max').innerHTML)).toEqual(9357931867);
      });
    });
  });
});

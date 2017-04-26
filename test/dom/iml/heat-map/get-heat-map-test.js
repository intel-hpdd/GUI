import _ from '@mfl/lodash-mixins';

describe('the heat map', function() {
  beforeEach(module('heatMap'));

  let getHeatMap, heatMap;

  beforeEach(
    inject(function(_getHeatMap_) {
      getHeatMap = _getHeatMap_;

      heatMap = getHeatMap();
    })
  );

  it('should be callable', function() {
    expect(heatMap).toEqual(jasmine.any(Function));
  });

  it('should set destroy to a noop', function() {
    expect(heatMap.destroy).toBe(_.noop);
  });

  const accessors = [
    'xValue',
    'yValue',
    'zValue',
    'xScale',
    'yScale',
    'colorScale',
    'width',
    'height',
    'duration'
  ];

  accessors.forEach(function(accessor) {
    it('should have a ' + accessor + 'accessor', function() {
      expect(heatMap[accessor]).toEqual(jasmine.any(Function));
    });

    it('should set ' + accessor, function() {
      const val = { foo: 'bar' };

      heatMap[accessor](val);

      expect(heatMap[accessor]()).toBe(val);
    });
  });

  describe('when populated', function() {
    let d3, heatMapGroup, selection, setup, query, queryAll;

    beforeEach(
      inject(function(_d3_) {
        d3 = _d3_;

        heatMapGroup = document.createElement('g');
        selection = d3.select(heatMapGroup);

        const svg = document.createElement('svg');
        svg.appendChild(heatMapGroup);

        query = heatMapGroup.querySelector.bind(heatMapGroup);
        queryAll = heatMapGroup.querySelectorAll.bind(heatMapGroup);

        const colors = ['#8ebad9', '#d6e2f3', '#fbb4b4', '#fb8181', '#ff6262'];
        const color = d3.scale
          .linear()
          .range(colors)
          .domain(d3.range(0, 1, 1.0 / (colors.length - 1)).concat(1));

        const zValue = _.pluckPath('data.stats_read_bytes');

        heatMap
          .width(500)
          .height(500)
          .xScale(d3.time.scale())
          .xValue(xValue)
          .yScale(d3.scale.ordinal())
          .yValue(_.property('id'))
          .zScale(d3.scale.linear().range([0, 1]))
          .zValue(zValue)
          .colorScale(color);

        function xValue(d) {
          return new Date(d.ts);
        }

        setup = function setup(d) {
          const merged = _.flatten(d);
          const keys = _(merged).pluck('id').uniq().value();

          heatMap.xScale().domain(d3.extent(merged, xValue)).range([0, 500]);

          heatMap.yScale().domain(keys).rangePoints([0, 500], 1.0);

          heatMap.zScale().domain(d3.extent(merged, zValue));

          selection.datum(d).call(heatMap);
        };
      })
    );

    it('should have 0 rows when there is no data', function() {
      selection.datum([]).call(heatMap);

      expect(heatMapGroup.querySelector('.row')).toEqual(null);
    });

    describe('with one data point', function() {
      beforeEach(function() {
        setup([
          [
            {
              data: { stats_read_bytes: 8091667852.6 },
              ts: '2015-05-11T11:44:10+00:00',
              id: '3'
            }
          ]
        ]);
      });

      it('should have one row', function() {
        expect(queryAll('.row').length).toEqual(1);
      });

      it('should have one cell', function() {
        expect(queryAll('.cell').length).toEqual(1);
      });

      it('should position the row at 0,0', function() {
        expect(query('.row').getAttribute('transform')).toEqual(
          'translate(0,0)'
        );
      });

      it('should set the cell to full height', function() {
        expect(query('.cell').getAttribute('height')).toEqual('500');
      });

      it('should set the cell to full width', function() {
        expect(query('.cell').getAttribute('width')).toEqual('500');
      });

      it('should fill the cell with the right color', function() {
        expect(query('.cell').getAttribute('fill')).toEqual('#8ebad9');
      });

      it('should remove the cell on exit', function() {
        setup([]);

        expect(queryAll('.cell').length).toBe(0);
      });
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

      it('should have one row', function() {
        expect(queryAll('.row').length).toBe(1);
      });

      it('should have two cells', function() {
        expect(queryAll('.cell').length).toBe(2);
      });

      it('should fill the first cell with the right color', function() {
        expect(queryAll('.cell')[0].getAttribute('fill')).toEqual('#8ebad9');
      });

      it('should fill the second cell with the right color', function() {
        expect(queryAll('.cell')[1].getAttribute('fill')).toEqual('#ff6262');
      });
    });
  });
});

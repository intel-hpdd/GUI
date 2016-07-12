import _ from 'intel-lodash-mixins';

describe('get heat map chart test', function () {
  'use strict';

  beforeEach(module('heatMap'));

  var getHeatMapChart, heatMapChart;

  beforeEach(inject(function (_getHeatMapChart_) {
    getHeatMapChart = _getHeatMapChart_;

    heatMapChart = getHeatMapChart();
  }));


  it('should be callable', function () {
    expect(heatMapChart).toEqual(jasmine.any(Function));
  });

  it('should set destroy to a noop', function () {
    expect(heatMapChart.destroy).toBe(_.noop);
  });

  var accessors = [
    'margin', 'formatter', 'zValue',
    'noData', 'xAxisLabel', 'xAxisDetail'
  ];

  accessors.forEach(function (accessor) {
    it('should have a ' + accessor + 'accessor', function () {
      expect(heatMapChart[accessor])
        .toEqual(jasmine.any(Function));
    });

    it('should set ' + accessor, function () {
      var val = { foo: 'bar' };

      heatMapChart[accessor](val);

      expect(heatMapChart[accessor]()).toBe(val);
    });
  });

  describe('when populated', function () {
    var d3, svg, div, setup, query, queryAll;

    beforeEach(inject(function (_d3_) {
      d3 = _d3_;

      div = document.createElement('div');

      svg = document
        .createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', 500);
      svg.setAttribute('height', 500);

      div.appendChild(svg);

      document.body
        .appendChild(div);

      heatMapChart
        .zValue(_.pluckPath('data.stats_read_bytes'));

      heatMapChart.xAxis()
        .tickFormat(d3.time.format.utc('%H:%M:%S'));

      query = svg.querySelector.bind(svg);
      queryAll = svg.querySelectorAll.bind(svg);

      setup = function setup (d) {
        d3.select(svg)
          .datum(d)
          .call(heatMapChart);
      };
    }));

    afterEach(function () {
      document
        .body
        .removeChild(div);
    });


    it('should show the no data message when there is no data', function () {
      setup([]);

      expect(query('.nv-noData').innerHTML).toEqual('No Data Available.');
    });

    describe('with one data point', function () {
      beforeEach(function () {
        setup([
          [{
            data: { stats_read_bytes: 8091667852.6 },
            ts: '2015-05-11T11:44:10+00:00',
            id: '3'
          }]
        ]);
      });

      it('should have one row', function () {
        expect(queryAll('.row').length).toEqual(1);
      });

      it('should have one cell', function () {
        expect(queryAll('.cell').length).toEqual(1);
      });

      it('should position the row at 0,0', function () {
        expect(query('.row').getAttribute('transform'))
          .toEqual('translate(0,0)');
      });

      it('should set the cell to height - margin', function () {
        expect(query('.cell').getAttribute('height')).toEqual('470');
      });

      it('should set the cell to width - margin', function () {
        expect(query('.cell').getAttribute('width')).toEqual('470');
      });

      it('should fill the cell with the right color', function () {
        expect(query('.cell').getAttribute('fill')).toEqual('#8ebad9');
      });

      it('should remove the cell on exit', function () {
        setup([]);

        expect(queryAll('.cell').length).toBe(0);
      });
    });

    describe('with multiple data points', function () {
      beforeEach(function () {
        setup([
          [
            {
              data: { stats_read_bytes: 8091667852.6 },
              ts: '2015-05-11T11:44:10+00:00',
              name: 'OST003',
              id: '3'
            },
            {
              data: { stats_read_bytes: 9357931867.8 },
              ts: '2015-05-11T11:44:20+00:00',
              name: 'OST003',
              id: '3'
            }
          ]
        ]);
      });

      it('should have one row', function () {
        expect(queryAll('.row').length).toBe(1);
      });

      it('should have two cells', function () {
        expect(queryAll('.cell').length).toBe(2);
      });

      it('should fill the first cell with the right color', function () {
        expect(queryAll('.cell')[0].getAttribute('fill'))
          .toEqual('#8ebad9');
      });

      it('should fill the second cell with the right color', function () {
        expect(queryAll('.cell')[1].getAttribute('fill'))
          .toEqual('#ff6262');
      });

      describe('when interacting', function () {
        var clickSpy;

        beforeEach(function () {
          clickSpy = jasmine.createSpy('onMouseClick');
          heatMapChart.dispatch.on('click', clickSpy);

          var event = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 50,
            bubbles: true });

          query('.cell').dispatchEvent(event);
        });

        afterEach(() => {
          document
            .body
            .removeChild(
              document
                .querySelector('.nvtooltip')
            );
        });

        it('should show the tooltip', function () {
          expect(document.querySelector('.nvtooltip')).not.toBe(null);
        });

        it('should show the z value', function () {
          expect(document.querySelector('.nvtooltip .value').innerHTML)
            .toEqual('8091667852.6');
        });

        it('should show the x value', function () {
          expect(document.querySelector('.nvtooltip .x-value').innerHTML)
            .toEqual('11:44:10');
        });

        it('should show the y value', function () {
          expect(document.querySelector('.nvtooltip tbody .key').innerHTML)
            .toEqual('OST003');
        });
      });
    });
  });
});

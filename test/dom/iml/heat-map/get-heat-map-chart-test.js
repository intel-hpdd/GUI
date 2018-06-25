import _ from '@iml/lodash-mixins';
import getHeatMapChart from '../../../../source/iml/heat-map/get-heat-map-chart.js';
import d3 from 'd3';

describe('get heat map chart test', () => {
  let heatMapChart;

  beforeEach(() => {
    window.d3 = d3;
  });

  afterEach(() => {
    delete window.d3;
  });

  beforeEach(() => {
    HTMLElement.prototype.getBBox = () => ({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    });

    heatMapChart = getHeatMapChart();
  });

  it('should be callable', () => {
    expect(heatMapChart).toEqual(expect.any(Function));
  });

  it('should set destroy to a noop', () => {
    expect(heatMapChart.destroy).toBe(_.noop);
  });

  const accessors = ['margin', 'formatter', 'zValue', 'noData', 'xAxisLabel', 'xAxisDetail', 'duration'];
  accessors.forEach(accessor => {
    it('should have a ' + accessor + 'accessor', () => {
      expect(heatMapChart[accessor]).toEqual(expect.any(Function));
    });

    it('should set ' + accessor, () => {
      const val = { foo: 'bar' };
      heatMapChart[accessor](val);
      expect(heatMapChart[accessor]()).toBe(val);
    });
  });

  describe('when populated', () => {
    let svg, div, setup, query, queryAll;

    beforeEach(() => {
      div = document.createElement('div');
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', 500);
      svg.setAttribute('height', 500);

      div.appendChild(svg);
      document.body.appendChild(div);

      heatMapChart.zValue(_.pluckPath('data.stats_read_bytes'));
      heatMapChart.xAxis().tickFormat(d3.time.format.utc('%H:%M:%S'));

      query = svg.querySelector.bind(svg);
      queryAll = svg.querySelectorAll.bind(svg);

      setup = function setup(d) {
        d3.select(svg).style('height', '500px');
        d3.select(svg).style('width', '500px');
        d3.select(svg)
          .datum(d)
          .call(heatMapChart);
      };
    });

    afterEach(() => {
      document.body.removeChild(div);
    });

    it('should show the no data message when there is no data', () => {
      setup([]);
      expect(query('.nv-noData').innerHTML).toEqual('No Data Available.');
    });

    describe('with one data point', () => {
      beforeEach(() => {
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

      it('should have one row', () => {
        expect(queryAll('.row').length).toEqual(1);
      });

      it('should have one cell', () => {
        expect(queryAll('.cell').length).toEqual(1);
      });

      it('should position the row at 0,0', () => {
        expect(query('.row').getAttribute('transform')).toEqual('translate(0,0)');
      });

      it('should set the cell to height - margin', () => {
        expect(query('.cell').getAttribute('height')).toEqual('470');
      });

      it('should set the cell to width - margin', () => {
        expect(query('.cell').getAttribute('width')).toEqual('470');
      });

      it('should fill the cell with the right color', () => {
        expect(query('.cell').getAttribute('fill')).toEqual('#8ebad9');
      });

      it('should remove the cell on exit', () => {
        setup([]);
        expect(queryAll('.cell').length).toBe(0);
      });
    });
    describe('with multiple data points', () => {
      beforeEach(() => {
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

      it('should have one row', () => {
        expect(queryAll('.row').length).toBe(1);
      });

      it('should have two cells', () => {
        expect(queryAll('.cell').length).toBe(2);
      });

      it('should fill the first cell with the right color', () => {
        expect(queryAll('.cell')[0].getAttribute('fill')).toEqual('#8ebad9');
      });

      it('should fill the second cell with the right color', () => {
        expect(queryAll('.cell')[1].getAttribute('fill')).toEqual('#ff6262');
      });

      describe('when interacting', () => {
        let clickSpy;
        beforeEach(() => {
          clickSpy = jest.fn();
          heatMapChart.dispatch.on('click', clickSpy);

          const event = new MouseEvent('mousemove', {
            clientX: 50,
            clientY: 50,
            bubbles: true
          });

          query('.cell').dispatchEvent(event);
        });

        afterEach(() => {
          const tooltip = document.querySelector('.nvtooltip');

          tooltip.parentNode.removeChild(tooltip);
        });

        it('should show the tooltip', () => {
          expect(document.querySelector('.nvtooltip')).not.toBe(null);
        });

        it('should show the z value', () => {
          expect(document.querySelector('.nvtooltip .value').innerHTML).toEqual('8091667852.6');
        });

        it('should show the x value', () => {
          expect(document.querySelector('.nvtooltip .x-value').innerHTML).toEqual('11:44:10');
        });

        it('should show the y value', () => {
          expect(document.querySelector('.nvtooltip tbody .key').innerHTML).toEqual('OST003');
        });
      });
    });
  });
});

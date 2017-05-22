import dateTicksFactory from '../../../../source/iml/charts/date-ticks.js';
import moment from 'moment';
import 'twix';
import d3 from 'd3';

describe('date ticks', () => {
  let dateTicks, start;

  beforeEach(() => {
    start = moment('2013-11-11 00:00');
    dateTicks = dateTicksFactory(d3);
  });

  it('should format correctly for different months', () => {
    const func = dateTicks.getTickFormatFunc(start.twix('2013-12-11 00:00'));

    expect(func('2013-11-12 06:30')).toEqual('Nov 12 06:30');
  });

  it('should format correctly for different days', () => {
    const func = dateTicks.getTickFormatFunc(start.twix('2013-11-12 00:00'));

    expect(func('2013-11-11 01:30:00')).toEqual('11 01:30:00');
  });

  it('should format correctly for the same day', () => {
    const func = dateTicks.getTickFormatFunc(start.twix('2013-11-11 09:00'));

    expect(func('2013-11-11 08:30')).toEqual('08:30:00');
  });

  it('should accept an array as a range', () => {
    const func = dateTicks.getTickFormatFunc([
      '2013-11-11 00:00',
      '2013-12-11 00:00'
    ]);

    expect(func('2013-11-12 13:30')).toEqual('Nov 12 13:30');
  });
});

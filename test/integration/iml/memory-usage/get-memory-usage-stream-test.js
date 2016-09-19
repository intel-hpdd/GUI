import highland from 'highland';
import moment from 'moment';
import memoryUsageDataFixtures from
  '../../../data-fixtures/memory-usage-fixtures.json!json';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('The memory usage stream', () => {
  var socketStream, serverStream, getServerMoment,
    getMemoryUsageStream, bufferDataNewerThan,
    getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-14T13:23:00.000Z'));

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine.createSpy('createDate')
      .and.callFake(arg => withDefault(
        () => new Date(),
        Maybe.of(arg)
          .map(x => new Date(x))));

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/memory-usage/get-memory-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getMemoryUsageStream = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  var fixtures, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = memoryUsageDataFixtures;
  });

  it('should return a factory function', () => {
    expect(getMemoryUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var memoryUsageStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      memoryUsageStream = getMemoryUsageStream(requestDuration, buff);

      memoryUsageStream
        .through(convertNvDates)
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return a stream', () => {
        expect(highland.isStream(memoryUsageStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        serverStream.write([]);
        serverStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return an empty nvd3 structure', () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Total memory',
            values: []
          },
          {
            key: 'Used memory',
            values: []
          },
          {
            key: 'Total swap',
            values: []
          },
          {
            key: 'Used swap',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Total memory',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 522092544
              }
            ]
          },
          {
            key: 'Used memory',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 497561600
              }
            ]
          },
          {
            key: 'Total swap',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 1073733632
              }
            ]
          },
          {
            key: 'Used swap',
            values: [
              {
                x: '2014-04-14T13:23:50.000Z',
                y: 0
              }
            ]
          }
        ]);
      });
    });
  });
});

import highland from 'highland';
import moment from 'moment';
import readWriteBandwidthDataFixtures from
  '../../../data-fixtures/read-write-bandwidth-fixtures';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('The read write bandwidth stream', () => {
  var socketStream, serverStream, getServerMoment,
    getReadWriteBandwidthStream, bufferDataNewerThan,
    getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2013-12-11T13:15:00+00:00'));

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine.createSpy('createDate')
      .and.callFake(arg => withDefault(
        () => new Date(),
        Maybe.of(arg)
          .map(x => new Date(x))));

    const getTimeParams = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParams.getRequestDuration;

    const mod = await mock('source/iml/read-write-bandwidth/get-read-write-bandwidth-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getReadWriteBandwidthStream = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  var fixtures, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = readWriteBandwidthDataFixtures;
  });

  it('should return a factory function', () => {
    expect(getReadWriteBandwidthStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var readWriteBandwidthStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      readWriteBandwidthStream = getReadWriteBandwidthStream(requestDuration, buff);

      readWriteBandwidthStream
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
        expect(highland.isStream(readWriteBandwidthStream)).toBe(true);
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
            key: 'read',
            values: []
          },
          {
            key: 'write',
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
            key: 'read',
            values: [
              { x: '2013-12-11T13:15:00.000Z', y: 106772238984.1 }
            ]
          },
          { key: 'write',
            values: [
              { x: '2013-12-11T13:15:00.000Z', y: -104418696882.20003 }
            ]
          }
        ]);
      });
    });
  });
});

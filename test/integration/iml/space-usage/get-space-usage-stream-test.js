import highland from 'highland';
import moment from 'moment';
import spaceUsageDataFixtures from
  '../../../data-fixtures/space-usage-fixtures';


import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('space usage stream', () => {
  var socketStream, serverStream, getServerMoment,
    getSpaceUsageStream, bufferDataNewerThan,
    getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-14T13:12:00+00:00'));

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

    const mod = await mock('source/iml/space-usage/get-space-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getSpaceUsageStream = mod.default;
  });

  afterEach(resetAll);

  var fixtures, spy, revert;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = spaceUsageDataFixtures;

    revert = patchRateLimit();
  });

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getSpaceUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var spaceUsageStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      spaceUsageStream = getSpaceUsageStream(requestDuration, buff);

      spaceUsageStream
        .through(convertNvDates)
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(spaceUsageStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should drop duplicate values', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        serverStream.write([]);
        serverStream.end();
      });

      it('should return an empty nvd3 structure', () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Space Used',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Space Used',
            values: [
              {
                x: '2014-04-14T13:11:50.000Z',
                y: 0.6627046805673511
              }
            ]
          }
        ]);
      });
    });
  });
});

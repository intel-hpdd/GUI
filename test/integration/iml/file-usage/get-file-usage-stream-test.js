import fileUsageDataFixtures from '../../../data-fixtures/file-usage-fixtures';
import highland from 'highland';
import moment from 'moment';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('file usage stream', () => {
  var socketStream, serverStream, getServerMoment,
    bufferDataNewerThan, getFileUsageStream, getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and
      .returnValue(moment('2014-04-14T13:40:00+00:00'));

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

    const mod = await mock('source/iml/file-usage/get-file-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getFileUsageStream = mod.default;
  });

  afterEach(resetAll);

  var fixtures, spy, revert;

  beforeEach(inject(() => {
    spy = jasmine.createSpy('spy');

    fixtures = fileUsageDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => revert());

  it('should return a factory function', () => {
    expect(getFileUsageStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var fileUsageStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      fileUsageStream = getFileUsageStream('Files Used', requestDuration, buff);

      fileUsageStream
        .through(convertNvDates)
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(fileUsageStream)).toBe(true);
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
            key: 'Files Used',
            values: []
          }
        ]);
      });

      it('should populate if data comes in on next tick', () => {
        serverStream.write(fixtures[0].in[0]);
        serverStream.end();

        expect(spy).toHaveBeenCalledOnceWith([
          {
            key: 'Files Used',
            values: [
              {
                x: '2014-04-14T13:39:40.000Z',
                y: 0.656037109375
              }
            ]
          }
        ]);
      });
    });
  });
});

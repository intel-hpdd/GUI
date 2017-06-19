import highland from 'highland';
import moment from 'moment';
import * as maybe from '@mfl/maybe';

import fileUsageDataFixtures from '../../../data-fixtures/file-usage-fixtures.json';

import { mock, resetAll } from '../../../system-mock.js';

describe('file usage stream', () => {
  let socketStream,
    serverStream,
    getServerMoment,
    bufferDataNewerThan,
    getFileUsageStream,
    getRequestDuration;

  beforeEachAsync(async function() {
    socketStream = jasmine.createSpy('socketStream').and.callFake(() => {
      return (serverStream = highland());
    });

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and.returnValue(moment('2014-04-14T13:40:00+00:00'));

    const bufferDataNewerThanModule = await mock(
      'source/iml/charting/buffer-data-newer-than.js',
      {
        'source/iml/get-server-moment.js': { default: getServerMoment }
      }
    );
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine
      .createSpy('createDate')
      .and.callFake(arg =>
        maybe.withDefault(
          () => new Date(),
          maybe.map(x => new Date(x), maybe.of(arg))
        )
      );

    const getTimeParamsModule = await mock(
      'source/iml/charting/get-time-params.js',
      {
        'source/iml/create-date.js': { default: createDate }
      }
    );
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/file-usage/get-file-usage-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getFileUsageStream = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  let fixtures, spy;

  beforeEach(
    inject(() => {
      spy = jasmine.createSpy('spy');

      fixtures = fileUsageDataFixtures;
    })
  );

  it('should return a factory function', () => {
    expect(getFileUsageStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let fileUsageStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({}, 10, 'minutes');

      fileUsageStream = getFileUsageStream('Files Used', requestDuration, buff);

      fileUsageStream.through(convertNvDates).each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
        jasmine.clock().tick(10000);
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
            key: 'Files Used',
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

import highland from 'highland';
import moment from 'moment';
import mdoDataFixtures
  from '../../../data-fixtures/mdo-data-fixture';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';


describe('mdo stream', () => {
  var socketStream, serverStream, bufferDataNewerThan,
    getServerMoment, getMdoStream, getRequestDuration;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (serverStream = highland());
      });

    getServerMoment = jasmine
      .createSpy('getServerMoment')
      .and
      .returnValue(moment('2013-11-15T19:25:20+00:00'));

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

    const mod = await mock('source/iml/mdo/get-mdo-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getMdoStream = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  var fixtures, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = mdoDataFixtures;
  });

  it('should return a factory function', () => {
    expect(getMdoStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var mdoStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      mdoStream = getMdoStream(requestDuration, buff);

      mdoStream
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
        expect(highland.isStream(mdoStream)).toBe(true);
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
            key: 'close',
            values: []
          },
          {
            key: 'getattr',
            values: []
          },
          {
            key: 'getxattr',
            values: []
          },
          {
            key: 'link',
            values: []
          },
          {
            key: 'mkdir',
            values: []
          },
          {
            key: 'mknod',
            values: []
          },
          {
            key: 'open',
            values: []
          },
          {
            key: 'rename',
            values: []
          },
          {
            key: 'rmdir',
            values: []
          },
          {
            key: 'setattr',
            values: []
          },
          {
            key: 'statfs',
            values: []
          },
          {
            key: 'unlink',
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
            key: 'close',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 280.2
            }
            ]
          },
          {
            key: 'getattr',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'getxattr',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 961.1
            }
            ]
          },
          {
            key: 'link',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'mkdir',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 413.2
            }
            ]
          },
          {
            key: 'mknod',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'open',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 91.9
            }
            ]
          },
          {
            key: 'rename',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'rmdir',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 863.3
            }
            ]
          },
          {
            key: 'setattr',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'statfs',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 0
            }
            ]
          },
          {
            key: 'unlink',
            values: [{
              x: '2013-11-15T19:25:20.000Z',
              y: 848.8
            }
            ]
          }
        ]);
      });
    });
  });
});

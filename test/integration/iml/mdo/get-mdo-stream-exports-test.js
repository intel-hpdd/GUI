describe('mdo stream', () => {
  var socketStream, serverStream, getServerMoment;

  beforeEach(window.module('mdo', 'dataFixtures', ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(() => {
        return (serverStream = highland());
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2013-11-15T19:25:20+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getMdoStream, fixtures, spy, revert;

  beforeEach(inject((_getMdoStream_, mdoDataFixtures) => {
    spy = jasmine.createSpy('spy');

    getMdoStream = _getMdoStream_;

    fixtures = mdoDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getMdoStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var mdoStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      mdoStream = getMdoStream(requestDuration, buff);

      mdoStream
        .through(convertNvDates)
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        serverStream.write(fixtures[0].in);
        serverStream.end();
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

describe('the get time params module', () => {
  var getServerMoment;

  beforeEach(module('charting'));

  describe('getRequestRange', () => {
    var getRequestRange;

    beforeEach(module(($provide) => {
      getServerMoment = jasmine.createSpy('getServerMoment')
        .andCallFake((d, f) => {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc(d, f);
        });

      $provide.value('getServerMoment', getServerMoment);
    }));

    beforeEach(inject((_getRequestRange_) => {
      getRequestRange = _getRequestRange_;
    }));

    it('should return a function', () => {
      expect(getRequestRange).toEqual(jasmine.any(Function));
    });

    describe('when invoked', () => {
      var requestRange;

      beforeEach(() => {
        requestRange = getRequestRange({
          qs: {
            id: '4'
          }
        }, '2015-04-30T00:00', '2015-05-01T00:00');
      });

      it('should return a function', () => {
        expect(requestRange)
          .toEqual(jasmine.any(Function));
      });

      it('should return a setLatest method', () => {
        expect(requestRange.setLatest)
          .toEqual(jasmine.any(Function));
      });

      it('should set the range on params', () => {
        var params = { qs: {} };

        expect(requestRange(params)).toEqual({
          qs: {
            id: '4',
            begin: '2015-04-30T00:00:00.000Z',
            end: '2015-05-01T00:00:00.000Z'
          }
        });
      });

      it('should clone the params', () => {
        var params = { qs: {} };

        expect(requestRange(params)).not.toBe(params);
      });
    });
  });

  describe('getRequestDuration', () => {
    var getRequestDuration, createDate;

    beforeEach(module(($provide) => {
      getServerMoment = jasmine.createSpy('getServerMoment')
        .andCallFake(() => {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc('2015-04-30T00:00:00.000Z');
        });

      $provide.value('getServerMoment', getServerMoment);

      createDate = jasmine.createSpy('createDate')
        .andCallFake((d) => {
          if (!d)
            d = '2015-04-30T00:00:10.000Z';

          return new Date(d);
        });

      $provide.value('createDate', createDate);
    }));

    beforeEach(inject((_getRequestDuration_) => {
      getRequestDuration = _getRequestDuration_;
    }));

    it('should return a function', () => {
      expect(getRequestDuration).toEqual(jasmine.any(Function));
    });

    describe('invoking', () => {
      var requestDuration;

      beforeEach(() => {
        requestDuration = getRequestDuration({
          qs: {
            id: '3'
          }
        }, 10, 'minutes');
      });

      it('should return a function', () => {
        expect(requestDuration).toEqual(jasmine.any(Function));
      });

      it('should set begin and end params', () => {
        var params = { qs: {} };

        expect(requestDuration(params)).toEqual({
          qs: {
            id: '3',
            begin: '2015-04-29T23:49:50.000Z',
            end: '2015-04-30T00:00:10.000Z'
          }
        });
      });

      it('should clone the params', () => {
        var params = { qs: {} };

        expect(requestDuration(params)).not.toEqual(params);
      });

      it('should update when latest is set', () => {
        var params = { qs: {} };

        highland([{ ts: '2015-04-30T00:00:00.000Z' }])
          .through(requestDuration.setLatest)
          .each(fp.noop);

        expect(requestDuration(params)).toEqual({
          qs: {
            id: '3',
            begin: '2015-04-30T00:00:10.000Z',
            end: '2015-04-30T00:00:00.000Z',
            update: true
          }
        });
      });
    });
  });

  describe('getTimeParams', () => {
    var getTimeParams;

    beforeEach(inject((_getTimeParams_) => {
      getTimeParams = _getTimeParams_;
    }));

    it('should return time param functions', () => {
      expect(getTimeParams).toEqual({
        getRequestDuration: jasmine.any(Function),
        getRequestRange: jasmine.any(Function)
      });
    });
  });
});

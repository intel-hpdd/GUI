describe('the get time params module', function () {
  'use strict';

  var getServerMoment;

  beforeEach(module('charting'));

  describe('getRequestRange', function () {
    var getRequestRange;

    beforeEach(module(function ($provide) {
      getServerMoment = jasmine.createSpy('getServerMoment')
        .andCallFake(function (d, f) {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc(d, f);
        });

      $provide.value('getServerMoment', getServerMoment);
    }));

    beforeEach(inject(function (_getRequestRange_) {
      getRequestRange = _getRequestRange_;
    }));

    it('should return a function', function () {
      expect(getRequestRange).toEqual(jasmine.any(Function));
    });

    describe('when invoked', function () {
      var requestRange;

      beforeEach(function () {
        requestRange = getRequestRange('2015-04-30T00:00', '2015-05-01T00:00');
      });

      it('should return a function', function () {
        expect(requestRange).toEqual(jasmine.any(Function));
      });

      it('should return a setLatest method', function () {
        expect(requestRange.setLatest).toEqual(jasmine.any(Function));
      });

      it('should return a setOverrides method', function () {
        expect(requestRange.setOverrides).toEqual(jasmine.any(Function));
      });

      it('should set the range on params', function () {
        var params = { qs: {} };

        requestRange.setOverrides({
          qs: {
            id: '4'
          }
        });

        expect(requestRange(params)).toEqual({
          qs: {
            id: '4',
            begin: '2015-04-30T00:00:00.000Z',
            end: '2015-05-01T00:00:00.000Z'
          }
        });
      });

      it('should clone the params', function () {
        var params = { qs: {} };

        expect(requestRange(params)).not.toEqual(params);
      });
    });
  });

  describe('getRequestDuration', function () {
    var getRequestDuration, createDate;

    beforeEach(module(function ($provide) {
      getServerMoment = jasmine.createSpy('getServerMoment')
        .andCallFake(function () {
          // We always convert local time to utc time
          // implicitly before send.
          // For the purposes of these tests,
          // force to UTC right away
          // so they will run in different time zones.
          return moment.utc('2015-04-30T00:00:00.000Z');
        });

      $provide.value('getServerMoment', getServerMoment);

      createDate = jasmine.createSpy('createDate')
        .andCallFake(function (d) {
          if (!d)
            d = '2015-04-30T00:00:10.000Z';

          return new Date(d);
        });

      $provide.value('createDate', createDate);
    }));

    beforeEach(inject(function (_getRequestDuration_) {
      getRequestDuration = _getRequestDuration_;
    }));

    it('should return a function', function () {
      expect(getRequestDuration).toEqual(jasmine.any(Function));
    });

    describe('invoking', function () {
      var requestDuration;

      beforeEach(function () {
        requestDuration = getRequestDuration(10, 'minutes');
      });

      it('should return a function', function () {
        expect(requestDuration).toEqual(jasmine.any(Function));
      });

      it('should return a setOverrides method', function () {
        expect(requestDuration.setOverrides).toEqual(jasmine.any(Function));
      });

      it('should set begin and end params', function () {
        var params = { qs: {} };

        requestDuration.setOverrides({
          qs: {
            id: '3'
          }
        });

        expect(requestDuration(params)).toEqual({
          qs: {
            id: '3',
            begin: '2015-04-29T23:49:50.000Z',
            end: '2015-04-30T00:00:10.000Z'
          }
        });
      });

      it('should clone the params', function () {
        var params = { qs: {} };

        expect(requestDuration(params)).not.toEqual(params);
      });

      it('should update when latest is set', function () {
        var params = { qs: {} };

        highland([{ ts: '2015-04-30T00:00:00.000Z' }])
          .through(requestDuration.setLatest)
          .each(_.noop);

        expect(requestDuration(params)).toEqual({
          qs: {
            begin: '2015-04-30T00:00:10.000Z',
            end: '2015-04-30T00:00:00.000Z',
            update: true
          }
        });
      });
    });
  });

  describe('getTimeParams', function () {
    var getTimeParams;

    beforeEach(inject(function (_getTimeParams_) {
      getTimeParams = _getTimeParams_;
    }));

    it('should return time param functions', function () {
      expect(getTimeParams).toEqual({
        getRequestDuration: jasmine.any(Function),
        getRequestRange: jasmine.any(Function)
      });
    });
  });
});

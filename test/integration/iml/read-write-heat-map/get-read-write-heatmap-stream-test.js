describe('the read write heat map stream', function () {
  'use strict';

  var socketStream, getServerMoment, streams;

  beforeEach(module('readWriteHeatMap', 'dataFixtures', function ($provide) {
    streams = {
      heatMap: [],
      target: []
    };

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function (path) {
        var s = highland();

        if (path === '/target/metric')
          streams.heatMap.push(s);
        else if (path === '/target')
          streams.target.push(s);

        return s;
      });

    $provide.value('socketStream', socketStream);

    getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2014-01-07T14:42:50+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getReadWriteHeatMapStream, fixtures, spy, revert;

  beforeEach(inject(function (_getReadWriteHeatMapStream_, readWriteHeatMapDataFixtures) {
    spy = jasmine.createSpy('spy');

    getReadWriteHeatMapStream = _getReadWriteHeatMapStream_;

    fixtures = readWriteHeatMapDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getReadWriteHeatMapStream)
      .toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', function () {
    var readWriteHeatMapStream;

    beforeEach(inject(function (getRequestDuration, bufferDataNewerThan) {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration(10, 'minutes');

      readWriteHeatMapStream = getReadWriteHeatMapStream('stats_read_bytes', requestDuration, buff);

      readWriteHeatMapStream
        .each(spy);
    }));

    describe('when there is data', function () {
      beforeEach(function () {
        streams.target[0].write({ objects: [] });
        streams.target[0].end();


        streams.heatMap[0].write(_.cloneDeep(fixtures[0].in));
        streams.heatMap[0].end();
      });

      it('should return a stream', function () {
        expect(highland.isStream(readWriteHeatMapStream))
          .toBe(true);
      });

      it('should return computed data', function () {
        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should maintain consistent data', function () {
        streams.heatMap[1].write(_.pick(fixtures[0].in, 1));
        streams.heatMap[1].end();
        streams.target[1].write({ objects: [] });
        streams.target[1].end();

        expect(spy)
          .toHaveBeenCalledWith(fixtures[0].out);
      });

      it('should union with a target', function () {
        streams.heatMap[1].write(_.pick(_.cloneDeep(fixtures[0].in), 1));
        streams.heatMap[1].end();
        streams.target[1].write({
          objects: [
            {
              id: '1',
              name: 'OST001'
            },
            {
              id: '2',
              name: 'OST002'
            }
          ]
        });
        streams.target[1].end();

        var result = _.cloneDeep(fixtures[0].out);

        result[0][0].name = 'OST001';
        result[1][0].name = 'OST002';

        expect(spy)
          .toHaveBeenCalledWith(result);
      });
    });

    describe('when there is no initial data', function () {
      beforeEach(function () {
        streams.heatMap[0].write({});
        streams.heatMap[0].end();
        streams.target[0].write({ objects: [] });
        streams.target[0].end();
      });

      it('should populate if data comes in on next tick', function () {
        streams.heatMap[1].write(_.pick(_.cloneDeep(fixtures[0].in), 1));
        streams.heatMap[1].end();
        streams.target[1].write({ objects: [] });
        streams.target[1].end();

        expect(spy).toHaveBeenCalledOnceWith([
          [
            {
              id: '1',
              name: '1',
              data: { stats_read_bytes: 7613151815.7 },
              ts: '2014-01-07T14:42:50+00:00'
            }
          ]
        ]);
      });
    });
  });
});

import angular from 'angular';
const {module, inject} = angular.mock;

import {lensProp} from 'intel-fp/fp';
import {clone} from 'intel-obj/obj';
import {getReadWriteHeatMapStreamFactory}
  from '../../../../source/chroma_ui/iml/read-write-heat-map/get-read-write-heat-map-stream-exports';

describe('the read write heat map stream', () => {
  var socketStream, getServerMoment, streams;

  beforeEach(module('readWriteHeatMap', 'dataFixtures', ($provide) => {
    streams = {
      heatMap: [],
      target: []
    };

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake((path) => {
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

  beforeEach(inject((readWriteHeatMapDataFixtures, chartPlugins) => {
    spy = jasmine.createSpy('spy');

    getReadWriteHeatMapStream = getReadWriteHeatMapStreamFactory(highland, socketStream, chartPlugins);

    fixtures = readWriteHeatMapDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getReadWriteHeatMapStream)
      .toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var readWriteHeatMapStream;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      readWriteHeatMapStream = getReadWriteHeatMapStream('stats_read_bytes', requestDuration, buff);

      readWriteHeatMapStream
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        streams.target[0].write({ objects: [] });
        streams.target[0].end();


        streams.heatMap[0].write(clone(fixtures[0].in));
        streams.heatMap[0].end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(readWriteHeatMapStream))
          .toBe(true);
      });

      it('should return computed data', () => {
        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should maintain consistent data', () => {
        streams.heatMap[1].write({ 1: fixtures[0].in[1] });
        streams.heatMap[1].end();
        streams.target[1].write({ objects: [] });
        streams.target[1].end();

        expect(spy)
          .toHaveBeenCalledWith(fixtures[0].out);
      });

      it('should union with a target', () => {
        streams.heatMap[1].write({ 1: lensProp(1)(clone(fixtures[0].in)) });
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

        var result = clone(fixtures[0].out);

        result[0][0].name = 'OST001';
        result[1][0].name = 'OST002';

        expect(spy)
          .toHaveBeenCalledWith(result);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        streams.heatMap[0].write({});
        streams.heatMap[0].end();
        streams.target[0].write({ objects: [] });
        streams.target[0].end();
      });

      it('should populate if data comes in on next tick', () => {
        streams.heatMap[1].write({ 1: lensProp(1)(clone(fixtures[0].in)) });
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

import highland from 'highland';
import moment from 'moment';
import readWriteHeatMapDataFixtures from
  '../../../data-fixtures/read-write-heat-map-fixtures';

import chartingModule from '../../../../source/iml/charting/charting-module';

import {
  lensProp,
  view
} from 'intel-fp';

import {
  clone
} from 'intel-obj';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('the read write heat map stream', () => {
  var socketStream, getServerMoment, streams, getReadWriteHeatMapStreamFactory;

  beforeEachAsync(async function () {
    streams = {
      heatMap: [],
      target: []
    };

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake((path) => {
        var s = highland();

        if (path === '/target/metric')
          streams.heatMap.push(s);
        else if (path === '/target')
          streams.target.push(s);

        return s;
      });

    await mock('source/iml/charting/union-with-target.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    const mod = await mock('source/iml/read-write-heat-map/get-read-write-heat-map-stream.js', {});

    getReadWriteHeatMapStreamFactory = mod.default;
  });

  beforeEach(module(chartingModule, $provide => {
    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-01-07T14:42:50+00:00'));

    $provide.value('getServerMoment', getServerMoment);
  }));

  var getReadWriteHeatMapStream, fixtures, spy, revert;

  beforeEach(inject(chartPlugins => {
    spy = jasmine.createSpy('spy');

    getReadWriteHeatMapStream = getReadWriteHeatMapStreamFactory(chartPlugins);

    fixtures = readWriteHeatMapDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  afterEach(resetAll);

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
        streams.heatMap[1].write({ 1: view(lensProp(1))(clone(fixtures[0].in)) });
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
        streams.heatMap[1].write({ 1: view(lensProp(1))(clone(fixtures[0].in)) });
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

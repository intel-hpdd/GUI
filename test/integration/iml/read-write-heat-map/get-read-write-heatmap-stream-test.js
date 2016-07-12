import highland from 'highland';
import moment from 'moment';
import readWriteHeatMapDataFixtures from
  '../../../data-fixtures/read-write-heat-map-fixtures';

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
  var socketStream, getServerMoment, streams, bufferDataNewerThan,
    getRequestDuration;

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

    getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2014-01-07T14:42:50+00:00'));

    await mock('source/iml/charting/union-with-target.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {});
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date': {
        default: () => new Date()
      }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/read-write-heat-map/get-read-write-heat-map-stream.js', {});

    getReadWriteHeatMapStream = mod.default;
  });

  var getReadWriteHeatMapStream, fixtures, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');

    fixtures = readWriteHeatMapDataFixtures;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  it('should return a factory function', () => {
    expect(getReadWriteHeatMapStream)
      .toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var readWriteHeatMapStream;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      readWriteHeatMapStream = getReadWriteHeatMapStream('stats_read_bytes', requestDuration, buff);

      readWriteHeatMapStream
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        streams.target[0].write({ objects: [] });
        streams.target[0].end();
        jasmine.clock().tick(10000);


        streams.heatMap[0].write(clone(fixtures[0].in));
        streams.heatMap[0].end();
        jasmine.clock().tick(10000);
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
        jasmine.clock().tick(10000);

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
        jasmine.clock().tick(10000);

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
        jasmine.clock().tick(10000);
      });

      it('should populate if data comes in on next tick', () => {
        streams.heatMap[1].write({ 1: view(lensProp(1))(clone(fixtures[0].in)) });
        streams.heatMap[1].end();
        streams.target[1].write({ objects: [] });
        streams.target[1].end();
        jasmine.clock().tick(10000);

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

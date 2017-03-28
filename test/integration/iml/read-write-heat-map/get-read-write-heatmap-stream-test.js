import highland from 'highland';
import { mock, resetAll } from '../../../system-mock.js';

describe('the read write heat map stream', () => {
  let socketStream,
    flushOnChange,
    getReadWriteHeatMapStream,
    spy,
    result$,
    heatMap$,
    change$;

  beforeEachAsync(async function() {
    heatMap$ = highland();
    change$ = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(heatMap$);
    flushOnChange = jasmine.createSpy('flushOnChange').and.returnValue(change$);
    spy = jasmine.createSpy('spy');

    const mod = await mock(
      'source/iml/read-write-heat-map/get-read-write-heat-map-stream.js',
      {
        'source/iml/socket/socket-stream.js': { default: socketStream },
        'source/iml/chart-transformers/chart-transformers.js': { flushOnChange }
      }
    );

    getReadWriteHeatMapStream = mod.default;
  });

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    result$ = getReadWriteHeatMapStream(
      { qs: { foo: 'bar', metrics: 'stats_read_bytes' } },
      { size: 10, unit: 'minutes' },
      undefined,
      -275
    );
    result$.each(spy);

    change$.write({
      '1': {
        ts: '2017-01-01T00:00:00+00:00',
        data: { stats_read_bytes: 123 }
      }
    });
  });

  afterEach(() => {
    resetAll();
    result$.destroy();
    change$.destroy();
  });

  it('should call socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/read-write-heat-map', {
      durationParams: { size: 10, unit: 'minutes' },
      rangeParams: undefined,
      timeOffset: -275,
      qs: {
        foo: 'bar',
        metrics: 'stats_read_bytes'
      }
    });
  });

  it('should call flushOnChange', () => {
    expect(flushOnChange).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should pass the data through the stream', () => {
    expect(spy).toHaveBeenCalledOnceWith({
      '1': {
        ts: '2017-01-01T00:00:00+00:00',
        data: { stats_read_bytes: 123 }
      }
    });
  });
});

import highland from 'highland';

describe('the read write heat map stream', () => {
  let mockSocketStream,
    mockFlushOnChange,
    getReadWriteHeatMapStream,
    spy,
    result$,
    change$;

  beforeEach(() => {
    mockSocketStream = jest.fn(() => {
      const s = highland();

      return s;
    });

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    mockFlushOnChange = jest.fn(() => (change$ = highland()));

    jest.mock(
      '../../../../source/iml/chart-transformers/chart-transformers.js',
      () => ({
        flushOnChange: mockFlushOnChange
      })
    );

    spy = jest.fn();

    getReadWriteHeatMapStream = require('../../../../source/iml/read-write-heat-map/get-read-write-heat-map-stream.js')
      .default;
  });

  beforeEach(() => {
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
    result$.destroy();
    change$.destroy();
  });

  it('should call socket stream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/read-write-heat-map', {
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
    expect(mockFlushOnChange).toHaveBeenCalledWith(expect.any(Object));
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

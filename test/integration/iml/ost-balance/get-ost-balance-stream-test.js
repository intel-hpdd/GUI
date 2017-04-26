import highland from 'highland';

describe('get OST balance stream', () => {
  let mockSocketStream, getOstBalanceStream, spy, end;

  beforeEach(() => {
    mockSocketStream = jest.fn(() => {
      const s = highland();

      end = x => {
        s.write(x);
        s.end();
        jest.runAllTimers();
      };

      return s;
    });

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    getOstBalanceStream = require('../../../../source/iml/ost-balance/get-ost-balance-stream.js')
      .default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getOstBalanceStream).toEqual(expect.any(Function));
  });

  describe('fetching metrics', () => {
    beforeEach(() => {
      getOstBalanceStream(0, {}).each(spy);

      end('foo');
    });

    it('should request data without overrides', () => {
      expect(mockSocketStream).toHaveBeenCalledTwiceWith(
        '/ost-balance',
        { percentage: 0 },
        true
      );
    });

    it('should return computed data', () => {
      expect(spy).toHaveBeenCalledOnceWith('foo');
    });
  });
});

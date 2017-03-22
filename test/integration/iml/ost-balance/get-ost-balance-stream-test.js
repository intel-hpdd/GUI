import highland from 'highland';

import ostBalanceModule
  from '../../../../source/iml/ost-balance/ost-balance-module';

import { mock, resetAll } from '../../../system-mock.js';

describe('get OST balance stream', () => {
  let socketStream, getOstBalanceStream, ostMetricsStream, flushOnChange;

  beforeEachAsync(async function() {
    socketStream = jasmine
      .createSpy('socketStream')
      .and.callFake(() => ostMetricsStream = highland());

    flushOnChange = jasmine.createSpy('flushOnChange').and.callFake(x => x);

    const mod = await mock('source/iml/ost-balance/get-ost-balance-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/chart-transformers/chart-transformers': { flushOnChange }
    });

    getOstBalanceStream = mod.default;

    jasmine.clock().install();
  });

  beforeEach(module(ostBalanceModule));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  it('should return a factory function', () => {
    expect(getOstBalanceStream).toEqual(jasmine.any(Function));
  });

  describe('fetching metrics', () => {
    let spy, ostBalanceStream;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');

      ostBalanceStream = getOstBalanceStream(0, {});

      ostBalanceStream.each(spy);

      ostMetricsStream.write('foo');
      ostMetricsStream.end();

      jasmine.clock().tick(10000);
    });

    it('should request data without overrides', () => {
      expect(socketStream).toHaveBeenCalledTwiceWith(
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

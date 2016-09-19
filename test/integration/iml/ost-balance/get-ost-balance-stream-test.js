import highland from 'highland';
import ostBalanceDataFixtures from
  '../../../data-fixtures/ost-balance-data-fixtures.json!json';
import ostBalanceModule from
  '../../../../source/iml/ost-balance/ost-balance-module';

import * as fp from 'intel-fp';
import {
  clone
} from 'intel-obj';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get OST balance stream', () => {
  var socketStream, targetStream, ostMetricsStream,
    getOstBalanceStream, fixtures, flushOnChange;

  beforeEachAsync(async function () {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake((path) => {
        if (path === '/target/metric')
          return (ostMetricsStream = highland());
        else if (path === '/target')
          return (targetStream = highland());
      });

    flushOnChange = jasmine.createSpy('flushOnChange')
      .and.callFake(x => x);

    const mod = await mock('source/iml/ost-balance/get-ost-balance-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/chart-transformers/chart-transformers': { flushOnChange }
    });

    getOstBalanceStream = mod.default;

    fixtures = ostBalanceDataFixtures;

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
    var spy, ostBalanceStream;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });

    describe('fetching gte 0 percent', () => {
      beforeEach(() => {
        ostBalanceStream = getOstBalanceStream(0, {
          qs: {
            filesystem_id: '1'
          }
        });

        ostBalanceStream.each(spy);

        ostMetricsStream.write(fixtures[0].in);
        ostMetricsStream.end();

        targetStream.write({ objects: [] });
        targetStream.end();

        jasmine.clock().tick(10000);
      });

      it('should call flushOnChange', () => {
        expect(flushOnChange).toHaveBeenCalledOnce();
      });

      it('should request data with overrides', () => {
        expect(socketStream).toHaveBeenCalledTwiceWith('/target/metric', {
          qs: {
            kind: 'OST',
            metrics: 'kbytestotal,kbytesfree',
            latest: true,
            filesystem_id: '1'
          }
        }, true);
      });

      it('should return computed data', () => {
        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });

    describe('fetching with filtered data', () => {
      beforeEach(() => {
        ostBalanceStream = getOstBalanceStream(2, {});

        ostBalanceStream.each(spy);

        ostMetricsStream.write(fixtures[0].in);
        ostMetricsStream.end();
        jasmine.clock().tick(10000);

        targetStream.write({
          objects: []
        });
        targetStream.end();
      });

      it('should return computed data', () => {
        var out = clone(fixtures[0].out);

        fp.map(fp.flow(
          fp.view(fp.lensProp('values')),
          fp.invokeMethod('pop', [])
        ))(out);

        expect(spy)
          .toHaveBeenCalledOnceWith(out);
      });
    });

    describe('fetching with matching targets', () => {
      var ostBalanceStream;

      beforeEach(() => {
        ostBalanceStream = getOstBalanceStream(0, {});

        ostBalanceStream.each(spy);

        ostMetricsStream.write(fixtures[0].in);
        ostMetricsStream.end();

        targetStream.write({
          objects: [
            {
              id: '18',
              name: 'OST001'
            },
            {
              id: '19',
              name: 'OST002'
            }
          ]
        });
        targetStream.end();

        jasmine.clock().tick(10000);
      });

      it('should request data without overrides', () => {
        expect(socketStream).toHaveBeenCalledTwiceWith('/target/metric', {
          qs: {
            kind: 'OST',
            metrics: 'kbytestotal,kbytesfree',
            latest: true
          }
        }, true);
      });

      it('should return computed data', () => {
        const xProp = fp.view(fp.lensProp('x'));
        const eqXProp = fp.eqFn(fp.identity, xProp);

        var setTargetName = fp.cond(
          [eqXProp('18'), xs => xs.x = 'OST001'],
          [eqXProp('19'), xs => xs.x = 'OST002']
        );

        fp.flow(
          fp.map(fp.view(fp.lensProp('values'))),
          fp.map(fp.map(setTargetName))
        )(fixtures[0].out);

        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });
  });
});

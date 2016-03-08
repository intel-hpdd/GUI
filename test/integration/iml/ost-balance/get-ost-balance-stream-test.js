import highland from 'highland';
import ostBalanceDataFixtures from
  '../../../data-fixtures/ost-balance-data-fixtures';
import ostBalanceModule from
  '../../../../source/iml/ost-balance/ost-balance-module';

import * as fp from 'intel-fp';
import {clone} from 'intel-obj';
import {getOstBalanceStreamFactory}
  from '../../../../source/iml/ost-balance/get-ost-balance-stream';

describe('get OST balance stream', () => {
  var socketStream, targetStream, ostMetricsStream;

  beforeEach(module(ostBalanceModule));

  var getOstBalanceStream, fixtures, revert;

  beforeEach(inject(formatBytes => {
    socketStream = jasmine.createSpy('socketStream')
      .and.callFake((path) => {
        if (path === '/target/metric')
          return (ostMetricsStream = highland());
        else if (path === '/target')
          return (targetStream = highland());
      });

    getOstBalanceStream = getOstBalanceStreamFactory(highland, socketStream, formatBytes);

    fixtures = ostBalanceDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

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
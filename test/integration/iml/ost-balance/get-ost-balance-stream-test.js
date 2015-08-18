describe('get OST balance stream', function () {
  'use strict';

  var socketStream, targetStream, ostMetricsStream;

  beforeEach(module('ostBalance', 'dataFixtures', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function (path) {
        if (path === '/target/metric')
          return (ostMetricsStream = highland());
        else if (path === '/target')
          return (targetStream = highland());
      });

    $provide.value('socketStream', socketStream);
  }));

  var getOstBalanceStream, fixtures, revert;

  beforeEach(inject(function (_getOstBalanceStream_, ostBalanceDataFixtures) {
    getOstBalanceStream = _getOstBalanceStream_;

    fixtures = ostBalanceDataFixtures;

    revert = patchRateLimit();
  }));

  afterEach(function () {
    revert();
  });

  it('should return a factory function', function () {
    expect(getOstBalanceStream).toEqual(jasmine.any(Function));
  });

  describe('fetching metrics', function () {
    var spy, ostBalanceStream;

    beforeEach(function () {
      spy = jasmine.createSpy('spy');
    });

    describe('fetching gte 0 percent', function () {
      beforeEach(function () {
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

      it('should request data with overrides', function () {
        expect(socketStream).toHaveBeenCalledTwiceWith('/target/metric', {
          qs: {
            kind: 'OST',
            metrics: 'kbytestotal,kbytesfree',
            latest: true,
            filesystem_id: '1'
          }
        }, true);
      });

      it('should return computed data', function () {
        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });

    describe('fetching with filtered data', function () {
      beforeEach(function () {
        ostBalanceStream = getOstBalanceStream(2);

        ostBalanceStream.each(spy);

        ostMetricsStream.write(fixtures[0].in);
        ostMetricsStream.end();

        targetStream.write({
          objects: []
        });
        targetStream.end();
      });

      it('should return computed data', function () {
        var out = _.cloneDeep(fixtures[0].out);

        var vals = _.map(out, _.pluckPath('values'));
        _.invoke(vals, 'pop');

        expect(spy)
          .toHaveBeenCalledOnceWith(out);
      });
    });

    describe('fetching with matching targets', function () {
      var ostBalanceStream;

      beforeEach(function () {
        ostBalanceStream = getOstBalanceStream(0);

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

      it('should request data without overrides', function () {
        expect(socketStream).toHaveBeenCalledTwiceWith('/target/metric', {
          qs: {
            kind: 'OST',
            metrics: 'kbytestotal,kbytesfree',
            latest: true
          }
        }, true);
      });

      it('should return computed data', function () {
        var vals = _.map(fixtures[0].out, _.pluckPath('values'));

        vals.map(_.fmap(function (val) {
          if (val.x === '18')
            val.x = 'OST001';
          else if (val.x === '19')
            val.x = 'OST002';
        }));


        expect(spy)
          .toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });
  });
});

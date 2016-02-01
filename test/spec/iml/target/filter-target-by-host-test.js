import targetModule from '../../../../source/iml/target/target-module';
import highland from 'highland';

describe('filter target by host', () => {
  beforeEach(module(targetModule));

  var filterTargetByHost, data;

  beforeEach(inject(function (_filterTargetByHost_) {
    filterTargetByHost = _filterTargetByHost_;

    data = [
      [
        {
          failover_servers: [
            '/api/host/5/'
          ],
          primary_server: '/api/host/3/'
        },
        {
          failover_servers: [
            '/api/host/8/'
          ],
          primary_server: '/api/host/7/'
        },
        {
          failover_servers: [
            '/api/host/7/'
          ],
          primary_server: '/api/host/5/'
        }
      ]
    ];
  }));

  it('should return targets matching host id', function () {
    var result;

    highland(data)
      .through(filterTargetByHost('5'))
      .each(function (x) {
        result = x;
      });

    expect(result).toEqual([
      {
        failover_servers: [
          '/api/host/5/'
        ],
        primary_server: '/api/host/3/'
      },
      {
        failover_servers: [
          '/api/host/7/'
        ],
        primary_server: '/api/host/5/'
      }
    ]);
  });

  it('should return nothing if targets do not match', function () {
    var result = filterTargetByHost('10')(data);

    expect(result).toEqual([[]]);
  });
});

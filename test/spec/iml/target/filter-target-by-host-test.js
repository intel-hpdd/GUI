import highland from 'highland';
import filterTargetByHost from '../../../../source/iml/target/filter-target-by-host.js';

describe('filter target by host', () => {
  let data;

  beforeEach(() => {
    data = [
      [
        {
          failover_servers: ['/api/host/5/'],
          primary_server: '/api/host/3/'
        },
        {
          failover_servers: ['/api/host/8/'],
          primary_server: '/api/host/7/'
        },
        {
          failover_servers: ['/api/host/7/'],
          primary_server: '/api/host/5/'
        }
      ]
    ];
  });

  it('should return targets matching host id', function() {
    let result;

    highland(data).through(filterTargetByHost('5')).each(function(x) {
      result = x;
    });

    expect(result).toEqual([
      {
        failover_servers: ['/api/host/5/'],
        primary_server: '/api/host/3/'
      },
      {
        failover_servers: ['/api/host/7/'],
        primary_server: '/api/host/5/'
      }
    ]);
  });

  it('should return nothing if targets do not match', function() {
    const result = filterTargetByHost('10')(data);

    expect(result).toEqual([[]]);
  });
});

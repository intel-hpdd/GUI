import { addHostIds } from '../../../../source/iml/logs/log-transforms.js';

describe('log transforms', () => {
  it('should map host ids to logs', () => {
    const logs = {
      objects: [
        {
          fqdn: 'foo.bar'
        }
      ]
    };

    const hosts = [
      {
        id: 1,
        fqdn: 'foo.bar'
      }
    ];

    expect(addHostIds([hosts, logs])).toEqual({
      objects: [
        {
          fqdn: 'foo.bar',
          host_id: 1
        }
      ]
    });
  });

  it('should return undefined if host id does not exist', () => {
    const logs = {
      objects: [
        {
          fqdn: 'foo.baz'
        }
      ]
    };

    const hosts = [
      {
        id: 1,
        fqdn: 'foo.bar'
      }
    ];

    expect(addHostIds([hosts, logs])).toEqual({
      objects: [
        {
          fqdn: 'foo.baz',
          host_id: undefined
        }
      ]
    });
  });
});

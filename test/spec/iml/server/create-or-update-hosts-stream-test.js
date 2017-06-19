import highland from 'highland';

describe('create or update hosts stream', () => {
  let mockSocketStream,
    mockCacheInitialData,
    mockServersToApiObjects,
    hostStreams,
    server,
    spy,
    resultStream;

  beforeEach(() => {

    jest.useFakeTimers();

    hostStreams = [];

    mockSocketStream = jest.fn(() => {
      const stream = highland();

      hostStreams.push(stream);

      return stream;
    });

    mockCacheInitialData = {
      server_profile: [
        {
          name: 'default',
          resource_uri: '/api/server_profile/default/'
        }
      ]
    };

    mockServersToApiObjects = jest.fn(() => [
      {
        address: 'storage0.localdomain',
        auth_type: 'existing_keys_choice'
      },
      {
        address: 'storage1.localdomain',
        auth_type: 'existing_keys_choice'
      }
    ]);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));
    jest.mock(
      '../../../../source/iml/server/servers-to-api-objects.js',
      () => mockServersToApiObjects
    );

    const mod = require('../../../../source/iml/server/create-or-update-hosts-stream.js');

    const createOrUpdateHostsStream = mod.default;

    spy = jest.fn();

    server = {
      auth_type: 'existing_keys_choice',
      addresses: ['storage0.localdomain', 'storage1.localdomain']
    };

    resultStream = createOrUpdateHostsStream(server);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should call serversToApiObjects', () => {
    expect(mockServersToApiObjects).toHaveBeenCalledOnceWith(server);
  });

  it('should return a stream', () => {
    expect(Object.getPrototypeOf(resultStream)).toBe(
      Object.getPrototypeOf(highland())
    );
  });

  describe('just posts', () => {
    beforeEach(() => {
      hostStreams[0].write({
        objects: []
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send a post through the spark', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/host',
        {
          method: 'post',
          json: {
            objects: [
              {
                auth_type: 'existing_keys_choice',
                address: 'storage0.localdomain',
                server_profile: '/api/server_profile/default/'
              },
              {
                auth_type: 'existing_keys_choice',
                address: 'storage1.localdomain',
                server_profile: '/api/server_profile/default/'
              }
            ]
          }
        },
        true
      );
    });

    it('should only send two calls', () => {
      expect(mockSocketStream).toHaveBeenCalledTimes(2);
    });

    describe('response', () => {
      let response;

      beforeEach(() => {
        response = {
          objects: [
            {
              command: {
                id: 1
              },
              host: {
                id: 1,
                address: 'storage0.localdomain'
              }
            },
            {
              command: {
                id: 2
              },
              host: {
                id: 2,
                address: 'storage1.localdomain'
              }
            }
          ]
        };

        hostStreams[1].write(response);
        hostStreams[1].write(highland.nil);
        jest.runAllTimers();
      });

      it('should resolve with the expected response', () => {
        expect(spy).toHaveBeenCalledOnceWith(response);
      });
    });
  });

  describe('just puts', () => {
    beforeEach(() => {
      hostStreams[0].write({
        objects: [
          { address: 'storage0.localdomain', state: 'undeployed' },
          { address: 'storage1.localdomain', state: 'undeployed' }
        ]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send through the stream', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/host',
        {
          method: 'put',
          json: {
            objects: [
              {
                auth_type: 'existing_keys_choice',
                address: 'storage0.localdomain',
                server_profile: '/api/server_profile/default/'
              },
              {
                auth_type: 'existing_keys_choice',
                address: 'storage1.localdomain',
                server_profile: '/api/server_profile/default/'
              }
            ]
          }
        },
        true
      );
    });

    it('should only send two calls', () => {
      expect(mockSocketStream).toHaveBeenCalledTimes(2);
    });

    it('should throw an error', () => {
      expect(() => {
        hostStreams[1].write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });
        hostStreams[1].write(highland.nil);
      }).toThrow('boom!');
    });
  });

  describe('posts and puts', () => {
    beforeEach(() => {
      hostStreams[0].write({
        objects: [{ address: 'storage0.localdomain', state: 'undeployed' }]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send a post through the spark', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/host',
        {
          method: 'post',
          json: {
            objects: [
              {
                auth_type: 'existing_keys_choice',
                address: 'storage1.localdomain',
                server_profile: '/api/server_profile/default/'
              }
            ]
          }
        },
        true
      );
    });

    it('should send a put through the spark', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/host',
        {
          method: 'put',
          json: {
            objects: [
              {
                auth_type: 'existing_keys_choice',
                address: 'storage0.localdomain',
                server_profile: '/api/server_profile/default/'
              }
            ]
          }
        },
        true
      );
    });

    it('should create three calls', () => {
      expect(mockSocketStream).toHaveBeenCalledTimes(3);
    });

    it('should send the expected response', () => {
      hostStreams[1].write({
        objects: [
          {
            command: { id: 2 },
            host: { id: 2, address: 'storage1.localdomain' }
          }
        ]
      });
      hostStreams[1].write(highland.nil);

      hostStreams[2].write({
        objects: [
          {
            command: { id: 1 },
            host: { id: 1, address: 'storage0.localdomain' }
          }
        ]
      });
      hostStreams[2].write(highland.nil);
      jest.runAllTimers();

      expect(spy).toHaveBeenCalledOnceWith({
        objects: [
          {
            command: { id: 2 },
            host: {
              id: 2,
              address: 'storage1.localdomain'
            }
          },
          {
            command: { id: 1 },
            host: {
              id: 1,
              address: 'storage0.localdomain'
            }
          }
        ]
      });
    });
  });

  describe('nothing', () => {
    beforeEach(() => {
      hostStreams[0].write({
        objects: [
          { address: 'storage0.localdomain' },
          { address: 'storage1.localdomain' }
        ]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should only call once', () => {
      expect(mockSocketStream).toHaveBeenCalledTimes(1);
    });

    it('should resolve with the unused hosts', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        objects: [
          {
            error: null,
            traceback: null,
            command_and_host: {
              command: false,
              host: { address: 'storage0.localdomain' }
            }
          },
          {
            error: null,
            traceback: null,
            command_and_host: {
              command: false,
              host: { address: 'storage1.localdomain' }
            }
          }
        ]
      });
    });
  });
});

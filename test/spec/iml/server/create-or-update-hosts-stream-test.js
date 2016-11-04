import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('create or update hosts stream', function () {
  let socketStream, CACHE_INITIAL_DATA, hostStreams,
    server, spy, resultStream;

  beforeEachAsync(async function () {
    hostStreams = [];

    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .callFake(() => {
        const stream = highland();

        hostStreams.push(stream);

        return stream;
      });

    CACHE_INITIAL_DATA = {
      server_profile: [{
        name: 'default',
        resource_uri: '/api/server_profile/default/'
      }]
    };

    const mod = await mock('source/iml/server/create-or-update-hosts-stream.js', {
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      },
      'source/iml/environment.js': {
        CACHE_INITIAL_DATA
      }
    });

    const createOrUpdateHostsStream = mod.default;

    spy = jasmine.createSpy('spy');

    server = {
      auth_type: 'existing_keys_choice',
      addresses: [
        'storage0.localdomain',
        'storage1.localdomain'
      ]
    };

    jasmine.clock().install();

    resultStream = createOrUpdateHostsStream(server);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  it('should return a stream', function () {
    expect(Object.getPrototypeOf(resultStream)).toBe(Object.getPrototypeOf(highland()));
  });

  describe('just posts', function () {
    beforeEach(function () {
      hostStreams[0].write({
        objects: []
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send a post through the spark', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
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
      }, true);
    });

    it('should only send two calls', function () {
      expect(socketStream).toHaveBeenCalledTwice();
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
        jasmine.clock().tick();
      });

      it('should resolve with the expected response', function () {
        expect(spy).toHaveBeenCalledOnceWith(response);
      });
    });
  });

  describe('just puts', function () {
    beforeEach(function () {
      hostStreams[0].write({
        objects: [
          { address: 'storage0.localdomain', state: 'undeployed' },
          { address: 'storage1.localdomain', state: 'undeployed' }
        ]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send through the stream', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
        method: 'put',
        json: {
          objects: [
            {
              auth_type: 'existing_keys_choice',
              address: 'storage0.localdomain',
              server_profile: '/api/server_profile/default/'
            },
            { auth_type: 'existing_keys_choice',
              address: 'storage1.localdomain',
              server_profile: '/api/server_profile/default/'
            }
          ]
        }
      }, true);
    });

    it('should only send two calls', function () {
      expect(socketStream).toHaveBeenCalledTwice();
    });

    it('should throw an error', function () {
      expect(function () {
        hostStreams[1].write({
          __HighlandStreamError__: true,
          error: new Error('boom!')
        });
        hostStreams[1].write(highland.nil);
      }).toThrow(new Error('boom!'));
    });
  });

  describe('posts and puts', function () {
    beforeEach(function () {
      hostStreams[0].write({
        objects: [
          { address: 'storage0.localdomain', state: 'undeployed' }
        ]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should send a post through the spark', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
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
      }, true);
    });

    it('should send a put through the spark', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/host', {
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
      }, true);
    });

    it('should create three calls', function () {
      expect(socketStream).toHaveBeenCalledNTimes(3);
    });

    it('should send the expected response', function () {
      hostStreams[1].write({
        objects: [
          { command: { id: 2 }, host: { id: 2, address: 'storage1.localdomain' } }
        ]
      });
      hostStreams[1].write(highland.nil);

      hostStreams[2].write({
        objects: [
          { command: { id: 1 }, host: { id: 1, address: 'storage0.localdomain' } }
        ]
      });
      hostStreams[2].write(highland.nil);
      jasmine.clock().tick();

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

  describe('nothing', function () {
    beforeEach(function () {
      hostStreams[0].write({
        objects: [
          { address: 'storage0.localdomain'},
          { address: 'storage1.localdomain'}
        ]
      });
      hostStreams[0].write(highland.nil);

      resultStream.each(spy);
    });

    it('should only call once', function () {
      expect(socketStream).toHaveBeenCalledOnce();
    });

    it('should resolve with the unused hosts', function () {
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

import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('lnet dispatch source', () => {
  let store, s, socketStream;

  beforeEachAsync(async function () {
    s = highland();
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .returnValue(s);

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    await mock('source/iml/lnet/lnet-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/environment.js': {
        ALLOW_ANONYMOUS_READ: true
      }
    });

    s
      .write({
        meta: 'meta',
        objects: [
          {
            id: 1
          }, {
            id: 2
          }
        ]
      });
  });

  afterEach(resetAll);

  it('should invoke the socket stream', () => {
    expect(socketStream)
      .toHaveBeenCalledOnceWith('/lnet_configuration', {
        qs: {
          dehydrate__host: false
        }
      });
  });

  it('should write the objects to the stream', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_LNET_CONFIGURATION_ITEMS',
      payload: [
        {
          id: 1
        }, {
          id: 2
        }
      ]
    });
  });

  it('should update lnetConfiguration when new items arrive from a persistent socket', () => {
    s.write({
      meta: 'meta',
      objects: ['more lnet configurations']
    });

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_LNET_CONFIGURATION_ITEMS',
      payload: ['more lnet configurations']
    });
  });
});

import highland from 'highland';
import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('server dispatch source', () => {
  let store, socketStream, s;

  beforeEachAsync(async function () {
    const CACHE_INITIAL_DATA = {
      host: ['host']
    };

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    s = highland();
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    await mock('source/iml/server/server-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/environment.js': { CACHE_INITIAL_DATA, ALLOW_ANONYMOUS_READ: true },
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });
  });

  afterEach(resetAll);

  beforeEach(() => {
    s.write({
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

  it('should dispatch cached servers into the store', () => {
    expect(store.dispatch)
      .toHaveBeenCalledOnceWith({
        type: 'ADD_SERVER_ITEMS',
        payload: ['host']
      });
  });

  it('should invoke the socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/host', {
      qs: { limit: 0 }
    });
  });

  it('should update servers when new items arrive from a persistent socket', () => {
    expect(store.dispatch)
      .toHaveBeenCalledOnceWith({
        type: 'ADD_SERVER_ITEMS',
        payload: [
          {
            id: 1
          }, {
            id: 2
          }
        ]
      });
  });
});

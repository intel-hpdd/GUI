import highland from 'highland';
import { mock, resetAll } from '../../../system-mock.js';

describe('user dispatch source', () => {
  let store, socketStream, s;

  beforeEachAsync(async function() {
    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    s = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(s);

    await mock('source/iml/user/user-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
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
        },
        {
          id: 2
        }
      ]
    });
  });

  it('should invoke the socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/user', {
      qs: {
        limit: 0
      }
    });
  });

  it('should update users when new items arrive from a persistent socket', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_USER_ITEMS',
      payload: [
        {
          id: 1
        },
        {
          id: 2
        }
      ]
    });
  });
});

import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('alert indicator dispatch source', () => {
  let store, stream, socketStream;

  beforeEachAsync(async function() {
    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    stream = highland();
    spyOn(stream, 'destroy');

    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);

    await mock(
      'source/iml/alert-indicator/alert-indicator-dispatch-source.js',
      {
        'source/iml/store/get-store.js': { default: store },
        'source/iml/socket/socket-stream.js': { default: socketStream },
        'source/iml/environment.js': {
          ALLOW_ANONYMOUS_READ: true
        }
      }
    );
  });

  afterEach(resetAll);

  it('should request alerts', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
      jsonMask: 'objects(affected,message)',
      qs: {
        limit: 0,
        active: true
      }
    });
  });

  it('should update alerts when new items arrive from a persistent socket', () => {
    stream.write({
      objects: ['more alerts']
    });

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_ALERT_INDICATOR_ITEMS',
      payload: ['more alerts']
    });
  });
});

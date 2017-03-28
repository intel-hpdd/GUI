import highland from 'highland';
import { mock, resetAll } from '../../../system-mock.js';

describe('job indicator dispatch source', () => {
  let store, socketStream, stream;

  beforeEachAsync(async function() {
    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    stream = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);

    await mock('source/iml/job-indicator/job-indicator-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/environment.js': {
        ALLOW_ANONYMOUS_READ: true
      }
    });
  });

  afterEach(resetAll);

  it('should request pending and tasked jobs', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/job/', {
      jsonMask: 'objects(write_locks,read_locks,description)',
      qs: {
        limit: 0,
        state__in: ['pending', 'tasked']
      }
    });
  });

  it('should pluck objects out of the stream', () => {
    stream.write({
      meta: 'meta',
      objects: [{ foo: 'bar' }]
    });

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_JOB_INDICATOR_ITEMS',
      payload: [{ foo: 'bar' }]
    });
  });
});

import highland from 'highland';

describe('job indicator dispatch source', () => {
  let mockStore, mockSocketStream, stream;

  beforeEach(() => {
    jest.resetModules();
    mockStore = {
      dispatch: jest.fn()
    };

    stream = highland();
    mockSocketStream = jest.fn(() => stream);

    jest.mock('../../../../source/iml/store/get-store.js', () => mockStore);
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );
    jest.mock('../../../../source/iml/environment.js', () => ({
      ALLOW_ANONYMOUS_READ: true
    }));

    require('../../../../source/iml/job-indicator/job-indicator-dispatch-source.js');
  });

  afterEach(() => {
    window.angular = null;
  });

  it('should request pending and tasked jobs', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/job/', {
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

    expect(mockStore.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_JOB_INDICATOR_ITEMS',
      payload: [{ foo: 'bar' }]
    });
  });
});

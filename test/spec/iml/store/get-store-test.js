import highland from 'highland';
import storeModule from '../../../../source/iml/store/store-module.js';

describe('get store', () => {
  var targetReducer, createStore, store,
    alertIndicatorReducer, alertIndicatorStream,
    jobIndicatorReducer, jobIndicatorStream,
    socketStream, stream, CACHE_INITIAL_DATA;

  beforeEach(module(storeModule, $provide => {
    targetReducer = {};
    $provide.value('targetReducer', targetReducer);

    alertIndicatorReducer = {};
    $provide.value('alertIndicatorReducer', alertIndicatorReducer);

    jobIndicatorReducer = {};
    $provide.value('jobIndicatorReducer', jobIndicatorReducer);

    jobIndicatorStream = highland();
    $provide.value('jobIndicatorStream', jobIndicatorStream);

    alertIndicatorStream = highland();
    $provide.value('alertIndicatorStream', alertIndicatorStream);

    stream = highland();
    socketStream = jasmine.createSpy('highland')
      .and
      .returnValue(stream);
    $provide.value('socketStream', socketStream);


    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    createStore = jasmine.createSpy('createStore')
      .and
      .returnValue(store);
    $provide.value('createStore', createStore);


    CACHE_INITIAL_DATA = {
      target: ['targets']
    };
    $provide.value('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
  }));

  var storeInstance;

  beforeEach(inject(_getStore_ => {
    storeInstance = _getStore_;
  }));

  it('should return a store', () => {
    expect(storeInstance).toBe(store);
  });

  it('should create a store', () => {
    expect(createStore).toHaveBeenCalledOnceWith({
      targets: targetReducer,
      alertIndicators: alertIndicatorReducer,
      jobIndicators: jobIndicatorReducer
    });
  });

  it('should dispatch cached targets into the store', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_TARGET_ITEMS',
      payload: ['targets']
    });
  });

  it('should setup a persistent socket to /targets', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/target', {
      qs: {
        limit: 0
      }
    });
  });

  it('should update targets when new items arrive from a persistent socket', () => {
    stream.write({
      objects: ['more targets']
    });

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_TARGET_ITEMS',
      payload: ['more targets']
    });
  });

  it('should update alerts when new items arrive from a persistent socket', () => {
    alertIndicatorStream.write(['more alerts']);

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_ALERT_INDICATOR_ITEMS',
      payload: ['more alerts']
    });
  });

  it('should update jobs when new items arrive from a persistent socket', () => {
    jobIndicatorStream.write(['more jobs']);

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_JOB_INDICATOR_ITEMS',
      payload: ['more jobs']
    });
  });
});

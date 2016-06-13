import highland from 'highland';
import {mock, resetAll} from '../../../system-mock.js';

describe('server dispatch source', () => {
  let store, serverStream;

  beforeEachAsync(async function () {
    const CACHE_INITIAL_DATA = {
      host: ['host']
    };

    serverStream = highland();

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const serverDispatchFactory = await mock('source/iml/server/server-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store },
      'source/iml/environment': { CACHE_INITIAL_DATA }
    });

    serverDispatchFactory.default(serverStream);
  });

  afterEach(resetAll);

  it('should dispatch cached servers into the store', () => {
    expect(store.dispatch)
      .toHaveBeenCalledOnceWith({
        type: 'ADD_SERVER_ITEMS',
        payload: ['host']
      });
  });

  it('should update servers when new items arrive from a persistent socket', () => {
    serverStream.write(['more hosts']);

    expect(store.dispatch)
      .toHaveBeenCalledOnceWith({
        type: 'ADD_SERVER_ITEMS',
        payload: ['more hosts']
      });
  });
});

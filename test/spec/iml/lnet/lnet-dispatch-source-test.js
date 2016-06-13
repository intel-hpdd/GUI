import highland from 'highland';
import {mock, resetAll} from '../../../system-mock.js';

describe('lnet dispatch source', () => {
  let store, lnetConfigurationStream;

  beforeEachAsync(async function () {
    lnetConfigurationStream = highland();

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const lnetDispatchFactory = await mock('source/iml/lnet/lnet-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store }
    });

    lnetDispatchFactory.default(lnetConfigurationStream);
  });

  afterEach(resetAll);

  it('should update lnetConfiguration when new items arrive from a persistent socket', () => {
    lnetConfigurationStream.write(['more lnet configurations']);

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_LNET_CONFIGURATION_ITEMS',
      payload: ['more lnet configurations']
    });
  });
});

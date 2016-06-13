import highland from 'highland';
import {mock, resetAll} from '../../../system-mock.js';

describe('alert indicator dispatch source', () => {
  let store, alertIndicatorStream;

  beforeEachAsync(async function () {
    alertIndicatorStream = highland();

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const alertIndicatorDispatchFactory = await mock('source/iml/alert-indicator/alert-indicator-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store }
    });

    alertIndicatorDispatchFactory.default(alertIndicatorStream);
  });

  afterEach(resetAll);

  it('should update alerts when new items arrive from a persistent socket', () => {
    alertIndicatorStream.write(['more alerts']);

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_ALERT_INDICATOR_ITEMS',
      payload: ['more alerts']
    });
  });
});

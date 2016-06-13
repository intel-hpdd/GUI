import highland from 'highland';
import {mock, resetAll} from '../../../system-mock.js';

describe('job indicator dispatch source', () => {
  let store, jobIndicatorStream;

  beforeEachAsync(async function () {
    jobIndicatorStream = highland();

    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    const jobIndicatorDispatchFactory = await mock('source/iml/job-indicator/job-indicator-dispatch-source.js', {
      'source/iml/store/get-store.js': { default: store }
    });

    jobIndicatorDispatchFactory.default(jobIndicatorStream);
  });

  afterEach(resetAll);

  it('should update jobs when new items arrive from a persistent socket', () => {
    jobIndicatorStream.write(['more jobs']);

    expect(store.dispatch).toHaveBeenCalledOnceWith({
      type: 'ADD_JOB_INDICATOR_ITEMS',
      payload: ['more jobs']
    });
  });
});

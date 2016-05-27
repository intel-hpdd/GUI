import {mock, resetAll} from '../../../system-mock.js';

describe('get store', () => {
  var targetReducer, createStore, store,
    alertIndicatorReducer,
    jobIndicatorReducer, serverReducer,
    lnetConfigurationReducer, treeReducer,
    storeInstance;

  beforeEachAsync(async function () {
    store = {
      dispatch: jasmine.createSpy('dispatch')
    };

    createStore = jasmine.createSpy('createStore')
      .and
      .returnValue(store);

    targetReducer = {};
    alertIndicatorReducer = {};
    jobIndicatorReducer = {};
    serverReducer = {};
    lnetConfigurationReducer = {};
    treeReducer = {};

    let storeModule = await mock('source/iml/store/get-store.js', {
      'source/iml/target/target-reducer.js': { default: targetReducer },
      'source/iml/alert-indicator/alert-indicator-reducer.js': { default: alertIndicatorReducer },
      'source/iml/job-indicator/job-indicator-reducer.js': { default: jobIndicatorReducer },
      'source/iml/server/server-reducer.js': { default: serverReducer },
      'source/iml/lnet/lnet-configuration-reducer.js': { default: lnetConfigurationReducer },
      'source/iml/tree/tree-reducer.js': { default: treeReducer },
      'source/iml/store/create-store.js': { default: createStore }
    });
    storeInstance = storeModule.default;
  });

  afterEach(resetAll);

  it('should return a store', () => {
    expect(storeInstance).toBe(store);
  });

  it('should create a store', () => {
    expect(createStore).toHaveBeenCalledOnceWith({
      targets: targetReducer,
      alertIndicators: alertIndicatorReducer,
      jobIndicators: jobIndicatorReducer,
      server: serverReducer,
      lnetConfiguration: lnetConfigurationReducer,
      tree: treeReducer
    });
  });
});

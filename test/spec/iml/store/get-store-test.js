import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get store', () => {
  let targetReducer, createStore, store,
    alertIndicatorReducer, readWriteBandwidthChartReducer,
    jobIndicatorReducer, serverReducer,
    lnetConfigurationReducer, treeReducer,
    fileSystemReducer, readWriteHeatMapChartReducer,
    mdoChartReducer, ostBalanceChartReducer,
    hostCpuRamChartReducer, agentVsCopytoolChartReducer,
    fileUsageChartReducer, spaceUsageChartReducer,
    cpuUsageChartReducer, memoryUsageChartReducer,
    userReducer, storeInstance, jobStatsReducer;

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
    fileSystemReducer = {};
    readWriteHeatMapChartReducer = {};
    mdoChartReducer = {};
    ostBalanceChartReducer = {};
    readWriteBandwidthChartReducer = {};
    hostCpuRamChartReducer = {};
    agentVsCopytoolChartReducer = {};
    fileUsageChartReducer = {};
    spaceUsageChartReducer = {};
    cpuUsageChartReducer = {};
    memoryUsageChartReducer = {};
    userReducer = {};
    jobStatsReducer = {};

    const storeModule = await mock('source/iml/store/get-store.js', {
      'source/iml/target/target-reducer.js': { default: targetReducer },
      'source/iml/alert-indicator/alert-indicator-reducer.js': { default: alertIndicatorReducer },
      'source/iml/job-indicator/job-indicator-reducer.js': { default: jobIndicatorReducer },
      'source/iml/server/server-reducer.js': { default: serverReducer },
      'source/iml/lnet/lnet-configuration-reducer.js': { default: lnetConfigurationReducer },
      'source/iml/tree/tree-reducer.js': { default: treeReducer },
      'source/iml/file-system/file-system-reducer.js': { default: fileSystemReducer },
      'source/iml/read-write-heat-map/read-write-heat-map-chart-reducer.js': { default: readWriteHeatMapChartReducer },
      'source/iml/mdo/mdo-chart-reducer.js': { default: mdoChartReducer },
      'source/iml/ost-balance/ost-balance-chart-reducer.js': { default: ostBalanceChartReducer },
      'source/iml/read-write-bandwidth/read-write-bandwidth-chart-reducer.js': {
        default: readWriteBandwidthChartReducer
      },
      'source/iml/host-cpu-ram-chart/host-cpu-ram-chart-reducer.js': { default: hostCpuRamChartReducer },
      'source/iml/agent-vs-copytool/agent-vs-copytool-chart-reducer.js': { default: agentVsCopytoolChartReducer },
      'source/iml/file-usage/file-usage-chart-reducer.js': { default: fileUsageChartReducer },
      'source/iml/space-usage/space-usage-chart-reducer.js': { default: spaceUsageChartReducer },
      'source/iml/cpu-usage/cpu-usage-chart-reducer.js': { default: cpuUsageChartReducer },
      'source/iml/memory-usage/memory-usage-chart-reducer.js': { default: memoryUsageChartReducer },
      'source/iml/user/user-reducer.js': { default: userReducer },
      'source/iml/store/create-store.js': { default: createStore },
      'source/iml/job-stats/job-stats-reducer': { default: jobStatsReducer }
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
      tree: treeReducer,
      fileSystems: fileSystemReducer,
      readWriteHeatMapCharts: readWriteHeatMapChartReducer,
      mdoCharts: mdoChartReducer,
      ostBalanceCharts: ostBalanceChartReducer,
      readWriteBandwidthCharts: readWriteBandwidthChartReducer,
      hostCpuRamCharts: hostCpuRamChartReducer,
      agentVsCopytoolCharts: agentVsCopytoolChartReducer,
      fileUsageCharts: fileUsageChartReducer,
      spaceUsageCharts: spaceUsageChartReducer,
      cpuUsageCharts: cpuUsageChartReducer,
      memoryUsageCharts: memoryUsageChartReducer,
      users: userReducer,
      jobStatsConfig: jobStatsReducer
    });
  });
});

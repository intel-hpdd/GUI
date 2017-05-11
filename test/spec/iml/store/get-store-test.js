describe('get store', () => {
  let mockMockMockMockTargetReducer,
    mockMockMockMockCreateStore,
    store,
    mockMockMockMockAlertIndicatorReducer,
    mockMockMockMockReadWriteBandwidthChartReducer,
    mockMockMockMockJobIndicatorReducer,
    mockMockMockMockServerReducer,
    mockMockMockMockLnetConfigurationReducer,
    mockMockMockMockTreeReducer,
    mockMockMockMockFileSystemReducer,
    mockMockMockMockReadWriteHeatMapChartReducer,
    mockMockMockMockMdoChartReducer,
    mockMockMockMockOstBalanceChartReducer,
    mockMockMockMockHostCpuRamChartReducer,
    mockMockMockMockAgentVsCopytoolChartReducer,
    mockMockMockMockFileUsageChartReducer,
    mockMockMockMockSpaceUsageChartReducer,
    mockMockMockMockCpuUsageChartReducer,
    mockMockMockMockMemoryUsageChartReducer,
    mockMockMockMockUserReducer,
    storeInstance,
    mockMockMockMockJobStatsReducer,
    mockMockMockMockLoginFormReducer,
    mockMockMockMockSessionReducer,
    mockMockMockMockStorageReducer;
  beforeEach(() => {
    store = { dispatch: jest.fn() };
    mockMockMockMockCreateStore = jest.fn(() => store);
    mockMockMockMockTargetReducer = {};
    mockMockMockMockAlertIndicatorReducer = {};
    mockMockMockMockJobIndicatorReducer = {};
    mockMockMockMockServerReducer = {};
    mockMockMockMockLnetConfigurationReducer = {};
    mockMockMockMockTreeReducer = {};
    mockMockMockMockFileSystemReducer = {};
    mockMockMockMockReadWriteHeatMapChartReducer = {};
    mockMockMockMockMdoChartReducer = {};
    mockMockMockMockOstBalanceChartReducer = {};
    mockMockMockMockReadWriteBandwidthChartReducer = {};
    mockMockMockMockHostCpuRamChartReducer = {};
    mockMockMockMockAgentVsCopytoolChartReducer = {};
    mockMockMockMockFileUsageChartReducer = {};
    mockMockMockMockSpaceUsageChartReducer = {};
    mockMockMockMockCpuUsageChartReducer = {};
    mockMockMockMockMemoryUsageChartReducer = {};
    mockMockMockMockUserReducer = {};
    mockMockMockMockJobStatsReducer = {};
    mockMockMockMockLoginFormReducer = {};
    mockMockMockMockSessionReducer = {};
    mockMockMockMockStorageReducer = {};
    jest.mock(
      '../../../../source/iml/target/target-reducer.js',
      () => mockMockMockMockTargetReducer
    );
    jest.mock(
      '../../../../source/iml/alert-indicator/alert-indicator-reducer.js',
      () => mockMockMockMockAlertIndicatorReducer
    );
    jest.mock(
      '../../../../source/iml/job-indicator/job-indicator-reducer.js',
      () => mockMockMockMockJobIndicatorReducer
    );
    jest.mock(
      '../../../../source/iml/server/server-reducer.js',
      () => mockMockMockMockServerReducer
    );
    jest.mock(
      '../../../../source/iml/lnet/lnet-configuration-reducer.js',
      () => mockMockMockMockLnetConfigurationReducer
    );
    jest.mock(
      '../../../../source/iml/tree/tree-reducer.js',
      () => mockMockMockMockTreeReducer
    );
    jest.mock(
      '../../../../source/iml/file-system/file-system-reducer.js',
      () => mockMockMockMockFileSystemReducer
    );
    jest.mock(
      '../../../../source/iml/read-write-heat-map/read-write-heat-map-chart-reducer.js',
      () => mockMockMockMockReadWriteHeatMapChartReducer
    );
    jest.mock(
      '../../../../source/iml/mdo/mdo-chart-reducer.js',
      () => mockMockMockMockMdoChartReducer
    );
    jest.mock(
      '../../../../source/iml/ost-balance/ost-balance-chart-reducer.js',
      () => mockMockMockMockOstBalanceChartReducer
    );
    jest.mock(
      '../../../../source/iml/read-write-bandwidth/read-write-bandwidth-chart-reducer.js',
      () => mockMockMockMockReadWriteBandwidthChartReducer
    );
    jest.mock(
      '../../../../source/iml/host-cpu-ram-chart/host-cpu-ram-chart-reducer.js',
      () => mockMockMockMockHostCpuRamChartReducer
    );
    jest.mock(
      '../../../../source/iml/agent-vs-copytool/agent-vs-copytool-chart-reducer.js',
      () => mockMockMockMockAgentVsCopytoolChartReducer
    );
    jest.mock(
      '../../../../source/iml/file-usage/file-usage-chart-reducer.js',
      () => mockMockMockMockFileUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/space-usage/space-usage-chart-reducer.js',
      () => mockMockMockMockSpaceUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/cpu-usage/cpu-usage-chart-reducer.js',
      () => mockMockMockMockCpuUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/memory-usage/memory-usage-chart-reducer.js',
      () => mockMockMockMockMemoryUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/user/user-reducer.js',
      () => mockMockMockMockUserReducer
    );
    jest.mock(
      '../../../../source/iml/store/create-store.js',
      () => mockMockMockMockCreateStore
    );
    jest.mock(
      '../../../../source/iml/job-stats/job-stats-reducer',
      () => mockMockMockMockJobStatsReducer
    );
    jest.mock(
      '../../../../source/iml/login/login-form-reducer',
      () => mockMockMockMockLoginFormReducer
    );
    jest.mock(
      '../../../../source/iml/session/session-reducer',
      () => mockMockMockMockSessionReducer
    );
    jest.mock(
      '../../../../source/iml/storage/storage-reducer',
      () => mockMockMockMockStorageReducer
    );
    const storeModule = require('../../../../source/iml/store/get-store.js');
    storeInstance = storeModule.default;
  });

  it('should return a store', () => {
    expect(storeInstance).toBe(store);
  });
  it('should create a store', () => {
    expect(mockMockMockMockCreateStore).toHaveBeenCalledOnceWith({
      targets: mockMockMockMockTargetReducer,
      alertIndicators: mockMockMockMockAlertIndicatorReducer,
      jobIndicators: mockMockMockMockJobIndicatorReducer,
      server: mockMockMockMockServerReducer,
      lnetConfiguration: mockMockMockMockLnetConfigurationReducer,
      tree: mockMockMockMockTreeReducer,
      fileSystems: mockMockMockMockFileSystemReducer,
      readWriteHeatMapCharts: mockMockMockMockReadWriteHeatMapChartReducer,
      mdoCharts: mockMockMockMockMdoChartReducer,
      ostBalanceCharts: mockMockMockMockOstBalanceChartReducer,
      readWriteBandwidthCharts: mockMockMockMockReadWriteBandwidthChartReducer,
      hostCpuRamCharts: mockMockMockMockHostCpuRamChartReducer,
      agentVsCopytoolCharts: mockMockMockMockAgentVsCopytoolChartReducer,
      fileUsageCharts: mockMockMockMockFileUsageChartReducer,
      spaceUsageCharts: mockMockMockMockSpaceUsageChartReducer,
      cpuUsageCharts: mockMockMockMockCpuUsageChartReducer,
      memoryUsageCharts: mockMockMockMockMemoryUsageChartReducer,
      users: mockMockMockMockUserReducer,
      jobStatsConfig: mockMockMockMockJobStatsReducer,
      loginForm: mockMockMockMockLoginFormReducer,
      session: mockMockMockMockSessionReducer,
      storage: mockMockMockMockStorageReducer
    });
  });
});

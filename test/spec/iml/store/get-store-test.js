describe('get store', () => {
  let mockTargetReducer,
    mockCreateStore,
    store,
    mockAlertIndicatorReducer,
    mockReadWriteBandwidthChartReducer,
    mockJobIndicatorReducer,
    mockServerReducer,
    mockLnetConfigurationReducer,
    mockTreeReducer,
    mockFileSystemReducer,
    mockReadWriteHeatMapChartReducer,
    mockMdoChartReducer,
    mockOstBalanceChartReducer,
    mockHostCpuRamChartReducer,
    mockAgentVsCopytoolChartReducer,
    mockFileUsageChartReducer,
    mockSpaceUsageChartReducer,
    mockCpuUsageChartReducer,
    mockMemoryUsageChartReducer,
    mockUserReducer,
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
      () => mockTargetReducer
    );
    jest.mock(
      '../../../../source/iml/alert-indicator/alert-indicator-reducer.js',
      () => mockAlertIndicatorReducer
    );
    jest.mock(
      '../../../../source/iml/job-indicator/job-indicator-reducer.js',
      () => mockJobIndicatorReducer
    );
    jest.mock(
      '../../../../source/iml/server/server-reducer.js',
      () => mockServerReducer
    );
    jest.mock(
      '../../../../source/iml/lnet/lnet-configuration-reducer.js',
      () => mockLnetConfigurationReducer
    );
    jest.mock(
      '../../../../source/iml/tree/tree-reducer.js',
      () => mockTreeReducer
    );
    jest.mock(
      '../../../../source/iml/file-system/file-system-reducer.js',
      () => mockFileSystemReducer
    );
    jest.mock(
      '../../../../source/iml/read-write-heat-map/read-write-heat-map-chart-reducer.js',
      () => mockReadWriteHeatMapChartReducer
    );
    jest.mock(
      '../../../../source/iml/mdo/mdo-chart-reducer.js',
      () => mockMdoChartReducer
    );
    jest.mock(
      '../../../../source/iml/ost-balance/ost-balance-chart-reducer.js',
      () => mockOstBalanceChartReducer
    );
    jest.mock(
      '../../../../source/iml/read-write-bandwidth/read-write-bandwidth-chart-reducer.js',
      () => mockReadWriteBandwidthChartReducer
    );
    jest.mock(
      '../../../../source/iml/host-cpu-ram-chart/host-cpu-ram-chart-reducer.js',
      () => mockHostCpuRamChartReducer
    );
    jest.mock(
      '../../../../source/iml/agent-vs-copytool/agent-vs-copytool-chart-reducer.js',
      () => mockAgentVsCopytoolChartReducer
    );
    jest.mock(
      '../../../../source/iml/file-usage/file-usage-chart-reducer.js',
      () => mockFileUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/space-usage/space-usage-chart-reducer.js',
      () => mockSpaceUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/cpu-usage/cpu-usage-chart-reducer.js',
      () => mockCpuUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/memory-usage/memory-usage-chart-reducer.js',
      () => mockMemoryUsageChartReducer
    );
    jest.mock(
      '../../../../source/iml/user/user-reducer.js',
      () => mockUserReducer
    );
    jest.mock(
      '../../../../source/iml/store/create-store.js',
      () => mockCreateStore
    );
    jest.mock(
      '../../../../source/iml/job-stats/job-stats-reducer',
      () => mockJobStatsReducer
    );
    jest.mock(
      '../../../../source/iml/login/login-form-reducer',
      () => mockLoginFormReducer
    );
    jest.mock(
      '../../../../source/iml/session/session-reducer',
      () => mockSessionReducer
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

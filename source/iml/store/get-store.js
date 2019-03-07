// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import createStore from "./create-store.js";

import agentVsCopytoolChartReducer from "../agent-vs-copytool/agent-vs-copytool-chart-reducer.js";
import alertIndicatorReducer from "../alert-indicator/alert-indicator-reducer.js";
import cpuUsageChartReducer from "../cpu-usage/cpu-usage-chart-reducer.js";
import fileSystemReducer from "../file-system/file-system-reducer.js";
import fileUsageChartReducer from "../file-usage/file-usage-chart-reducer.js";
import hostCpuRamChartReducer from "../host-cpu-ram-chart/host-cpu-ram-chart-reducer.js";
import jobIndicatorReducer from "../job-indicator/job-indicator-reducer.js";
import jobStatsReducer from "../job-stats/job-stats-reducer.js";
import lnetConfigurationReducer from "../lnet/lnet-configuration-reducer.js";
import mdoChartReducer from "../mdo/mdo-chart-reducer.js";
import memoryUsageChartReducer from "../memory-usage/memory-usage-chart-reducer.js";
import ostBalanceChartReducer from "../ost-balance/ost-balance-chart-reducer.js";
import readWriteBandwidthChartReducer from "../read-write-bandwidth/read-write-bandwidth-chart-reducer.js";
import readWriteHeatMapChartReducer from "../read-write-heat-map/read-write-heat-map-chart-reducer.js";
import serverReducer from "../server/server-reducer.js";
import spaceUsageChartReducer from "../space-usage/space-usage-chart-reducer.js";
import targetReducer from "../target/target-reducer.js";
import treeReducer from "../tree/tree-reducer.js";
import userReducer from "../user/user-reducer.js";
import loginFormReducer from "../login/login-form-reducer.js";
import sessionReducer from "../session/session-reducer.js";
import storageReducer from "../storage/storage-reducer.js";
import tzPickerReducer from "../tz-picker/tz-picker-reducer.js";
import disconnectModalReducer from "../disconnect-modal/disconnect-modal-reducer.js";
import locksReducer from "../locks/locks-reducer.js";
import exceptionModalReducer from "../exception/exception-modal-reducer.js";
import confirmActionReducer from "../action-dropdown/confirm-action-reducer.js";
import commandModalReducer from "../command/command-modal-reducer.js";

export default createStore({
  agentVsCopytoolCharts: agentVsCopytoolChartReducer,
  alertIndicators: alertIndicatorReducer,
  cpuUsageCharts: cpuUsageChartReducer,
  fileSystems: fileSystemReducer,
  fileUsageCharts: fileUsageChartReducer,
  hostCpuRamCharts: hostCpuRamChartReducer,
  jobIndicators: jobIndicatorReducer,
  jobStatsConfig: jobStatsReducer,
  lnetConfiguration: lnetConfigurationReducer,
  mdoCharts: mdoChartReducer,
  memoryUsageCharts: memoryUsageChartReducer,
  ostBalanceCharts: ostBalanceChartReducer,
  readWriteBandwidthCharts: readWriteBandwidthChartReducer,
  readWriteHeatMapCharts: readWriteHeatMapChartReducer,
  server: serverReducer,
  spaceUsageCharts: spaceUsageChartReducer,
  targets: targetReducer,
  tree: treeReducer,
  users: userReducer,
  loginForm: loginFormReducer,
  session: sessionReducer,
  storage: storageReducer,
  tzPicker: tzPickerReducer,
  disconnectModal: disconnectModalReducer,
  locks: locksReducer,
  exceptionModal: exceptionModalReducer,
  confirmAction: confirmActionReducer,
  commandModal: commandModalReducer
});

// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import createStore from './create-store.js';

import agentVsCopytoolChartReducer from '../agent-vs-copytool/agent-vs-copytool-chart-reducer.js';
import alertIndicatorReducer from '../alert-indicator/alert-indicator-reducer.js';
import cpuUsageChartReducer from '../cpu-usage/cpu-usage-chart-reducer.js';
import fileSystemReducer from '../file-system/file-system-reducer.js';
import fileUsageChartReducer from '../file-usage/file-usage-chart-reducer.js';
import hostCpuRamChartReducer from '../host-cpu-ram-chart/host-cpu-ram-chart-reducer.js';
import jobIndicatorReducer from '../job-indicator/job-indicator-reducer.js';
import jobStatsReducer from '../job-stats/job-stats-reducer.js';
import lnetConfigurationReducer from '../lnet/lnet-configuration-reducer.js';
import mdoChartReducer from '../mdo/mdo-chart-reducer.js';
import memoryUsageChartReducer from '../memory-usage/memory-usage-chart-reducer.js';
import ostBalanceChartReducer from '../ost-balance/ost-balance-chart-reducer.js';
import readWriteBandwidthChartReducer from '../read-write-bandwidth/read-write-bandwidth-chart-reducer.js';
import readWriteHeatMapChartReducer from '../read-write-heat-map/read-write-heat-map-chart-reducer.js';
import serverReducer from '../server/server-reducer.js';
import spaceUsageChartReducer from '../space-usage/space-usage-chart-reducer.js';
import targetReducer from '../target/target-reducer.js';
import treeReducer from '../tree/tree-reducer.js';
import userReducer from '../user/user-reducer.js';
import loginFormReducer from '../login/login-form-reducer.js';
import sessionReducer from '../auth/session-reducer.js';

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
  session: sessionReducer
});

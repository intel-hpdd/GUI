// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import jobStatsTableComponent from './job-stats-table-component.js';

export default angular.module('jobStats', []).component('jobStatsTable', jobStatsTableComponent).name;

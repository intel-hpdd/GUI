// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { jobstats$, getData } from './job-stats-resolves.js';

export const jobStatsState = {
  name: 'app.jobstats',
  url: '/jobstats?id&startDate&endDate',
  resolve: {
    jobstats$,
    getData
  },
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'view_job_statistics.htm',
    anonymousReadProtected: true,
    eulaState: true,
    kind: 'Job Stats',
    icon: 'fa-signal'
  },
  template: `
  <div class="container container-full">
    <job-stats-table stats-$="$resolve.jobstats$"></job-stats-table>
  </div>
  `
};

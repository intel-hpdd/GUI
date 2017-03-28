// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { mgt$, mgtJobIndicatorB, mgtAlertIndicatorB } from './mgt-resolves.js';

import { GROUPS } from '../auth/authorization.js';

export const mgtState = {
  name: 'app.mgt',
  url: '/configure/mgt',
  component: 'mgtPage',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: 'mgts_tab.htm',
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    eulaState: true,
    kind: 'MGTs',
    icon: 'fa-bullseye'
  },
  resolve: {
    mgt$,
    mgtAlertIndicatorB,
    mgtJobIndicatorB
  }
};

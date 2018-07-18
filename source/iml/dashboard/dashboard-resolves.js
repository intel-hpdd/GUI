//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import broadcaster from '../broadcaster.js';

export const dashboardFsB = () => {
  return broadcaster(store.select('fileSystems'));
};

export const dashboardHostB = () => {
  return broadcaster(store.select('server'));
};

export const dashboardTargetB = () => {
  return broadcaster(store.select('targets'));
};

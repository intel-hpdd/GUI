// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { storageB, alertIndicatorB } from './storage-resolves.js';

export const addStorageState = {
  name: 'app.addStorage',
  url: '/configure/storage/add',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Add Storage Device',
    icon: 'fa-hdd-o'
  },
  resolve: { storageB },
  component: 'addStorage'
};

export const storageState = {
  name: 'app.storage',
  url: '/configure/storage',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Storage',
    icon: 'fa-hdd-o'
  },
  resolve: { storageB, alertIndicatorB },
  component: 'storage'
};

export const storageStateDetail = {
  name: 'app.storageDetail',
  url: '/configure/storage/:id',
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    kind: 'Storage Detail',
    icon: 'fa-hdd-o'
  },
  resolve: {},
  component: 'storageDetail'
};

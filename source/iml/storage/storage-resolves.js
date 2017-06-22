// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { streamToPromise } from '../promise-transforms.js';

import { matchById } from '../api-transforms.js';

export const StorageDetailResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      'ngInject';
      return streamToPromise(
        socketStream(`/storage_resource/${$stateParams.id}`, {}, true)
      ).then(x => ({ label: x.plugin_name }));
    }
  }
};

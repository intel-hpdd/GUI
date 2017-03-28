// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as maybe from 'intel-maybe';
import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';

import { streamToPromise } from '../promise-transforms.js';

import { matchById } from '../api-transforms.js';

export const oldFilesystemDetailResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      'ngInject';
      return streamToPromise(store.select('fileSystems')).then(
        matchById($stateParams.id)
      );
    }
  }
};

export const oldUserDetailResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      'ngInject';
      return streamToPromise(store.select('users').filter(xs => xs.length))
        .then(matchById($stateParams.id))
        .then(maybe.map((x: Object) => ({ label: x.username })))
        .then(maybe.withDefault(() => ({ label: '' })));
    }
  }
};

export const oldTargetResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      'ngInject';
      return streamToPromise(store.select('targets')).then(
        matchById($stateParams.id)
      );
    }
  }
};

export const oldStoragePluginResolve = {
  resolve: {
    getData: ($stateParams: { id: string }) => {
      'ngInject';
      return streamToPromise(
        socketStream(`/storage_resource/${$stateParams.id}`, {}, true)
      ).then(x => ({ label: x.plugin_name }));
    }
  }
};

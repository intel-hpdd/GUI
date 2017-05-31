//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


import socketStream from '../socket/socket-stream.js';
import broadcaster from '../broadcaster.js';
import store from '../store/get-store.js';

import {
  matchById
} from '../api-transforms.js';

import {
  resolveStream,
  streamToPromise
} from '../promise-transforms.js';

import {
  map,
  lensProp,
  view,
  flow
} from 'intel-fp';

const pluckObjects = map(view(lensProp('objects')));

export function fsCollStream () {
  return resolveStream(socketStream('/filesystem', {
    jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
  }))
    .then(
      flow(
        pluckObjects,
        broadcaster
      )
    );
}

export const getData = ($stateParams:{fsId?:string}) => {
  'ngInject';

  if ($stateParams.fsId)
    return streamToPromise(
      store
        .select('fileSystems')
        .map(matchById($stateParams.fsId))
    );
  else
    return Promise.resolve({ label: null });
};

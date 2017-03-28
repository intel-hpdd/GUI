//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import socketStream from '../socket/socket-stream.js';
import angular from 'angular';

export default function getCopytoolStream(params) {
  params = angular.merge(
    {},
    {
      qs: {
        limit: 0
      },
      jsonMask: 'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
    },
    params || {}
  );

  const viewLensProp = fp.flow(fp.lensProp, fp.view);
  const statusLens = fp.lensProp('status');
  const viewStateLens = viewLensProp('state');

  const setStatus = fp.cond(
    [
      fp.flow(fp.eqFn(fp.identity, viewStateLens, 'started'), fp.not),
      x => fp.set(statusLens, viewStateLens(x), x)
    ],
    [
      fp.eqFn(fp.identity, viewLensProp('active_operations_count'), 0),
      fp.set(statusLens, 'idle')
    ],
    [fp.always(true), fp.set(statusLens, 'working')]
  );

  const setStatuses = fp.map(
    fp.flow(viewLensProp('objects'), fp.over(fp.mapped, setStatus))
  );

  return socketStream('/copytool', params).through(setStatuses);
}

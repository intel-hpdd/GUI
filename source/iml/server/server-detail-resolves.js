// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from '../store/get-store.js';
import socketStream from '../socket/socket-stream.js';
import getNetworkInterfaceStream from '../lnet/get-network-interface-stream.js';
import angular from 'angular';
import * as fp from 'intel-fp';
import broadcaster from '../broadcaster.js';
const viewLens = fp.flow(fp.lensProp, fp.view);

import {
  matchById
} from '../api-transforms.js';

import {
  streamToPromise
} from '../promise-transforms.js';

import {
  resolveStream
} from '../promise-transforms.js';

export const getData = ($stateParams:{id:string}) => {
  'ngInject';

  return streamToPromise(store
    .select('server')
    .map(matchById($stateParams.id))
  );
};

export default function serverDetailResolves ($stateParams:{id:string}) {
  'ngInject';

  var arrOrNull = fp.cond(
    [viewLens('length'), fp.identity],
    [fp.always(true), fp.always(null)]
  );

  var getObjectsOrNull = fp.flow(viewLens('objects'), arrOrNull);
  var getFlatObjOrNull = fp.flow(fp.map(getObjectsOrNull), fp.invokeMethod('flatten', []));

  const jobMonitorStream = broadcaster(
    store
      .select('jobIndicators')
  );

  const alertMonitorStream = broadcaster(
    store
      .select('alertIndicators')
  );

  const serverStream = store
    .select('server')
    .map(fp.find(x => x.id === $stateParams.id));

  var allHostMatches = {
    qs: {
      host__id: $stateParams.id,
      limit: 0
    }
  };

  const lnetConfigurationStream = broadcaster(
    store
      .select('lnetConfiguration')
      .map(fp.find(x => x.host === `/api/host/${$stateParams.id}/`))
  );

  const merge = fp.curry2((a, b) => angular.merge(a, b, allHostMatches));

  var networkInterfaceStream = resolveStream(getNetworkInterfaceStream(merge({}, {
    jsonMask: 'objects(id,inet4_address,name,nid,lnd_types,resource_uri)'
  })));

  var cs = socketStream('/corosync_configuration', merge({}, {
    jsonMask: 'objects(resource_uri,available_actions,mcast_port,locks,state,id,network_interfaces)'
  }));

  var cs2 = cs
    .through(getFlatObjOrNull);

  var corosyncConfigurationStream = resolveStream(cs2)
    .then(broadcaster);

  var ps = socketStream('/pacemaker_configuration', merge({}, {
    jsonMask: 'objects(resource_uri,available_actions,locks,state,id)'
  }));

  var ps2 = ps
    .through(getFlatObjOrNull);

  var pacemakerConfigurationStream = resolveStream(ps2)
    .then(broadcaster);

  return Promise.all([
    jobMonitorStream,
    alertMonitorStream,
    serverStream,
    lnetConfigurationStream,
    networkInterfaceStream,
    corosyncConfigurationStream,
    pacemakerConfigurationStream
  ])
  .then(([
    jobMonitorStream,
    alertMonitorStream,
    serverStream,
    lnetConfigurationStream,
    networkInterfaceStream,
    corosyncConfigurationStream,
    pacemakerConfigurationStream
  ]) => ({
    jobMonitorStream,
    alertMonitorStream,
    serverStream,
    lnetConfigurationStream,
    networkInterfaceStream,
    corosyncConfigurationStream,
    pacemakerConfigurationStream
  }));
}

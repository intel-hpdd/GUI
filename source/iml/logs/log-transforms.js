// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';

const getHostByFqdn = (hosts, fqdn) => fp.find(
  x => x.fqdn === fqdn,
  hosts
);

type objArr = Object[];

export function addHostIds ([servers, logs]:objArr) {
  logs.objects = logs.objects.map(log => {
    const host = getHostByFqdn(servers, log.fqdn);

    return {
      ...log,
      host_id: host && host.id
    };
  });

  return logs;
}

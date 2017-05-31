//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import LNET_OPTIONS from './lnet-options.js';

import {
  map
} from 'intel-fp';

export default function getNetworkInterfaceStream (params) {
  var stream = socketStream('/network_interface', params || {});

  var s2 = stream
    .pluck('objects')
    .map(map(function setNidIfEmpty (x) {
      if (!x.nid)
        x.nid = {
          lnd_type: x.lnd_types[0],
          lnd_network: LNET_OPTIONS[0].value,
          network_interface: x.resource_uri
        };

      return x;
    }));

  s2.destroy = stream.destroy.bind(stream);

  return s2;
}

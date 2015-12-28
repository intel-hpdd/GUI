//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import angular from 'angular';

import {map} from 'intel-fp/fp';

angular.module('lnetModule')
  .factory('getNetworkInterfaceStream', ['socketStream', 'LNET_OPTIONS',
    function getNetworkInterfaceStreamFactory (socketStream, LNET_OPTIONS) {
      'use strict';

      return function getNetworkInterfaceStream (params) {
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
      };
    }
  ]);

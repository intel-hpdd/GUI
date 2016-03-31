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

import {map, flow, lensProp, view} from 'intel-fp';

const pluckObjects = map(view(lensProp('objects')));

export default function serverResolvesFactory ($q, resolveStream, addProperty, rebindDestroy,
                                               getStore, socketStream) {
  'ngInject';

  return function serverResolves () {
    const jobMonitorStream = addProperty(
      getStore
        .select('jobIndicators')
    );

    const alertMonitorStream = addProperty(
      getStore
        .select('alertIndicators')
    );

    const lnetConfigurationStream = resolveStream(socketStream('/lnet_configuration', {
      jsonMask: 'objects(state,host,resource_uri)',
      qs: {
        dehydrate__host: false
      }
    }))
      .then(flow(
        rebindDestroy(pluckObjects),
        addProperty
      ));


    const serversStream = resolveStream(socketStream('/host', {
      jsonMask: 'objects(id,address,available_actions,boot_time,fqdn,immutable_state,install_method,label,\
locks,member_of_active_filesystem,needs_update,nodename,resource_uri,server_profile(ui_name,managed,initial_state),\
state)',
      qs: { limit: 0 }
    }));

    return $q.all({
      jobMonitorStream,
      alertMonitorStream,
      lnetConfigurationStream,
      serversStream
    });
  };
}

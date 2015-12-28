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

import {map, flow, lensProp, always,
  cond, eqFn, identity, not} from 'intel-fp/fp';
import rebindDestroy from '../highland/rebind-destroy-exports';
import angular from 'angular';

export default function getCopytoolStreamFactory (socketStream) {
  'ngInject';

  return function getCopytoolStream (params) {
    params = angular.merge({}, {
      qs: {
        limit: 0
      },
      jsonMask: 'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
    }, params || {});

    const statusLens = lensProp('status');
    const stateLens = lensProp('state');

    const setStatus = cond(
      [
        flow(eqFn(identity, stateLens, 'started'), not),
        (x) => statusLens.set(stateLens(x), x)
      ],
      [
        eqFn(identity, lensProp('active_operations_count'), 0),
        statusLens.set('idle')
      ],
      [
        always(true),
        statusLens.set('working')
      ]
    );

    const setStatuses = map(
      flow(
        lensProp('objects'),
        map(setStatus)
      )
    );

    return socketStream('/copytool', params)
      .through(rebindDestroy(setStatuses));
  };
}

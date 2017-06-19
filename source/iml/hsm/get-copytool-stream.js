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

import * as fp from '@mfl/fp';
import socketStream from '../socket/socket-stream.js';

export default function getCopytoolStream(params) {
  params = Object.assign(
    {},
    {
      qs: {
        limit: 0
      },
      jsonMask:
        'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
    },
    params || {}
  );

  const viewLensProp = fp.flow(fp.lensProp, fp.view);
  const statusLens = fp.lensProp('status');
  const viewStateLens = viewLensProp('state');

  const setStatus = fp.cond(
    [
      fp.flow(fp.eqFn(fp.identity)(viewStateLens)('started'), fp.not),
      x => fp.set(statusLens)(viewStateLens(x))(x)
    ],
    [
      fp.eqFn(fp.identity)(viewLensProp('active_operations_count'))(0),
      fp.set(statusLens)('idle')
    ],
    [fp.always(true), fp.set(statusLens)('working')]
  );

  const setStatuses = fp.map(
    fp.flow(viewLensProp('objects'), fp.over(fp.mapped)(setStatus))
  );

  return socketStream('/copytool', params).through(setStatuses);
}

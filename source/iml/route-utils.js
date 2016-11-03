// @flow

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

import extractApi from 'intel-extract-api';

import * as maybe from 'intel-maybe';

import type {
  Maybe
} from 'intel-maybe';

import type {
  TransitionT
} from 'angular-ui-router';

export function apiPathToUiPath (resourceUri:string) {
  var resource = resourceUri.split('/')[2];
  var id = extractApi(resourceUri);

  switch(resource) {
  case 'filesystem':
    return `configure/filesystem/${id}/`;
  case 'host':
    return `configure/server/${id}/`;
  default:
    return `${resource}/${id}/`;
  }
}

export const getResolvedData = (transition:TransitionT, resolveName:string):Maybe<any> => {
  return maybe.map(
    n => {
      if (transition.getResolveTokens().indexOf(n) > -1)
        return transition.getResolveValue(n);
    },
    maybe.of(resolveName)
  );
};

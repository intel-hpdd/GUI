// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from 'intel-extract-api';

import * as maybe from 'intel-maybe';

import type {
  Maybe
} from 'intel-maybe';

import type {
  TransitionT
} from 'angular-ui-router';

export function apiPathToUiPath (resourceUri:string) {
  const resource = resourceUri.split('/')[2];
  const id = extractApi(resourceUri);

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

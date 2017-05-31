// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from 'intel-extract-api';

import Maybe from 'intel-maybe';

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

export function getResolvedData (transition:TransitionT, resolveName:string):Maybe {
  return Maybe.of(resolveName)
    .map(n => {
      if (transition.getResolveTokens().indexOf(n) > -1)
        return transition.getResolveValue(n);
    });
}

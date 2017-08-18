// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from '@iml/extract-api';

import * as maybe from '@iml/maybe';

import * as fp from '@iml/fp';

import type { Maybe } from '@iml/maybe';

import type { TransitionT } from 'angular-ui-router';

export function apiPathToUiPath(resourceUri: string) {
  const resource = resourceUri.split('/')[2];
  const id = extractApi(resourceUri);

  switch (resource) {
    case 'filesystem':
      return `configure/filesystem/${id}/`;
    case 'host':
      return `configure/server/${id}/`;
    default:
      return `${resource}/${id}/`;
  }
}

export const getResolvedData = (
  transition: TransitionT,
  resolveName: string
): Maybe<any> => {
  const resolvedToken = maybe.chain(
    x => fp.find(val => val === x)(transition.getResolveTokens()),
    maybe.of(resolveName)
  );
  return maybe.map(transition.getResolveValue.bind(transition), resolvedToken);
};

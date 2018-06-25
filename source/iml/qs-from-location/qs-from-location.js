// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { StateServiceT } from 'angular-ui-router';

export default function qsFromLocationFactory($state: StateServiceT) {
  'ngInject';
  const UrlMatcher = $state.router.urlMatcherFactory.UrlMatcher;

  return function qsFromLocation(params: Object): string {
    let parts =
      new UrlMatcher($state.transition.to().url, $state.router.urlMatcherFactory.paramTypes).format(params) || '';

    parts = parts.split('?');
    return parts.length > 1 ? parts.pop() : '';
  };
}

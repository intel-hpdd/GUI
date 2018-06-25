// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import highland from 'highland';
import angular from 'angular';

import { querySelector } from './dom-utils.js';

import type { HighlandStreamT } from 'highland';

type stateServiceT = {
  go: (name: string) => void
};

type cacheT = {
  $state?: stateServiceT
};

const cache: cacheT = {};

type servicesT = '$state';
type methodsT = 'go';

export default <R>(service: servicesT, method: methodsT, ...args: any[]): HighlandStreamT<R> => {
  const s: HighlandStreamT<R> = highland();
  const inj = angular.element(querySelector(document, 'body')).injector();

  function loop() {
    if (cache[service]) {
      const fn: Function = cache[service][method];
      s.write(fn(...args));
      s.end();
    } else if (inj.has(service)) {
      const svc = inj.get(service);
      const fn: Function = svc[method];
      cache[service] = svc;
      s.write(fn(...args));
      s.end();
    } else {
      setTimeout(loop, 0);
    }
  }

  loop();

  return s;
};

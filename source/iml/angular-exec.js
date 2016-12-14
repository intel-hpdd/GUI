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

import highland from 'highland';
import angular from 'angular';
import * as Maybe from 'intel-maybe';

import type {
  HighlandStreamT
} from 'highland';

const cache = {};

export default <R>(service:string, method:string, ...args:any[]):HighlandStreamT<R> => {
  const s:HighlandStreamT<R> = highland();
  const inj = angular.element(document.body).injector();

  function loop () {
    setTimeout(() => {
      if (cache[service] || inj.has(service)) {
        const svc:Object = Maybe.withDefault(
          () => inj.get(service),
          Maybe.of(cache[service])
        );
        const fn:Function = svc[method];

        s.write(fn(...args));
        s.end();
      } else {
        loop();
      }
    }, 0);
  }

  loop();

  return s;
};

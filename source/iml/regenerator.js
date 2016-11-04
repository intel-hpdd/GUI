// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type {
  HighlandStreamT
} from 'highland';

type streamToVoid = (x:HighlandStreamT<mixed>) => void;

export default (setup:Function, teardown:streamToVoid) => {
  const cache:Object = {};

  const getter = function get () {
    const args = [].slice.call(arguments, 0);
    const key = args.shift();

    if (cache[key]) {
      teardown(cache[key]);
      delete cache[key];
    }

    return (cache[key] = setup.apply(setup, args));
  };

  getter.destroy = function destroy () {
    Object.keys(cache).forEach(function teardownItem (key) {
      teardown(cache[key]);
    });
  };

  return getter;
};

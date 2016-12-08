// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from 'intel-fp';
import getCommandStream from '../command/get-command-stream.js';

import {
  setState,
  isFinished
} from './command-transforms.js';

import type {
  commandT
} from './command-types.js';

export default (openCommandModal:Function) => {
  'ngInject';

  return fp.curry2((showModal:boolean, response:commandT[]) => {
    const command$ = getCommandStream(response)
      .map(
        fp.map(setState)
      );

    if (showModal) {
      const commandModal$ = command$.fork();
      const modal$ = openCommandModal(commandModal$);
      modal$.resultStream
        .each(() =>
          commandModal$.destroy()
        );
    }

    return command$
      .fork()
      .filter(
        fp.every(isFinished)
      )
      .tap(() => setTimeout(() => command$.destroy()));
  });
};

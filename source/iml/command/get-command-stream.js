//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

// @flow

import socketStream from '../socket/socket-stream.js';

import type {
  commandResponseT,
  commandT
} from './command-types.js';

import {
  compose,
  lensProp,
  mapped,
  view
} from 'intel-fp';

export default (commandList:commandT[]):commandResponseT => {
  const options = {
    qs: {
      id__in: view(
        compose(
          mapped,
          lensProp('id')
        ),
        commandList
      )
    }
  };

  const stream:commandResponseT = socketStream('/command', options);

  stream
    .write({
      objects: commandList
    });

  return stream
    .pluck('objects');
};

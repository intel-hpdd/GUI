// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from '../socket/socket-stream.js';
import * as fp from 'intel-fp';

import type { commandT } from './command-types.js';

import type { HighlandStreamT } from 'highland';

export default (commandList: commandT[]): HighlandStreamT<commandT[]> => {
  const options = {
    qs: {
      id__in: fp.view(fp.compose(fp.mapped, fp.lensProp('id')), commandList)
    }
  };

  const stream: HighlandStreamT<{ objects: commandT[] }> = socketStream(
    '/command',
    options
  );

  stream.write({
    objects: commandList
  });

  return stream.pluck('objects');
};

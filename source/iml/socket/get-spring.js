// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import regenerator from '../regenerator.js';
import socketStream from '../socket/socket-stream.js';

import type { HighlandStreamT } from 'highland';

export default () => {
  return regenerator(
    (path, params) => {
      return socketStream(path, params);
    },
    function teardown(stream: HighlandStreamT<mixed>) {
      stream.destroy();
    }
  );
};

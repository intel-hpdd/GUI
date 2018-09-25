// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import socketStream from "../socket/socket-stream.js";

import type { Command } from "./command-types.js";

import type { HighlandStreamT } from "highland";

export default (commandList: Command[]): HighlandStreamT<Command[]> => {
  const options = {
    qs: {
      id__in: commandList.map(x => x.id)
    }
  };

  const stream: HighlandStreamT<{ objects: Command[] }> = socketStream("/command", options);

  stream.write({
    objects: commandList
  });

  return stream.pluck("objects");
};

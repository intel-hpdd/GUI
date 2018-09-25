// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import getCommandStream from "../command/get-command-stream.js";

import { setState, isFinished } from "./command-transforms.js";

import type { Command } from "./command-types.js";

export default (openCommandModal: Function) => {
  "ngInject";

  return (showModal: boolean) => (response: Command[]) => {
    const command$ = getCommandStream(response).map(fp.map(setState));

    if (showModal) {
      const commandModal$ = command$.fork();
      openCommandModal(commandModal$).resultStream.each(() => commandModal$.destroy());
    }

    return command$
      .fork()
      .filter(fp.every(isFinished))
      .tap(() => setTimeout(() => command$.destroy()));
  };
};

// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import getCommandStream from "../command/get-command-stream.js";
import getStore from "../store/get-store.js";

import { setState, isFinished } from "./command-transforms.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";

import type { Command } from "./command-types.js";

export default () => {
  "ngInject";

  return (showModal: boolean) => (commands: Command[]) => {
    if (showModal)
      getStore.dispatch({
        type: SHOW_COMMAND_MODAL_ACTION,
        payload: commands
      });

    const command$ = getCommandStream(commands).map(fp.map(setState));
    return command$.filter(fp.every(isFinished)).tap(() => setTimeout(() => command$.destroy()));
  };
};

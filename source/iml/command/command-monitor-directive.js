// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import { render } from "inferno";
import socketStream from "../socket/socket-stream.js";
import getStore from "../store/get-store.js";

import { SHOW_EXCEPTION_MODAL_ACTION } from "../exception/exception-modal-reducer.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";

import type { $scopeT } from "angular";

const showPending = commands => {
  getStore.dispatch({
    type: SHOW_COMMAND_MODAL_ACTION,
    payload: commands
  });
};

const CommandMonitor = ({ showPending, commands }) => {
  return (
    <a onClick={() => showPending(commands)}>
      <i class="fa fa-refresh fa-spin command-in-progress" />
    </a>
  );
};

export function CommandMonitorCtrl($scope: $scopeT, $element: HTMLElement[]) {
  "ngInject";

  const commandMonitor$ = socketStream("/command", {
    qs: {
      limit: 0,
      errored: false,
      complete: false
    }
  });

  commandMonitor$
    .map(x => x.objects)
    .map(fp.filter(x => x.cancelled === false))
    .tap(x => (this.length = x.length))
    .tap(x => (this.lastObjects = x))
    .stopOnError(e => {
      getStore.dispatch({
        type: SHOW_EXCEPTION_MODAL_ACTION,
        payload: e
      });
    })
    .each(commands => {
      if (commands.length > 0) render(<CommandMonitor showPending={showPending} commands={commands} />, $element[0]);
      else render(null, $element[0]);
    });

  $scope.$on("$destroy", () => {
    commandMonitor$.destroy();
    render(null, $element[0]);
  });
}

export default () => ({
  restrict: "A",
  controller: CommandMonitorCtrl,
  controllerAs: "$ctrl"
});

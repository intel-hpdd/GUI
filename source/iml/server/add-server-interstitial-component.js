// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { Component } from "inferno";
import getStore from "../store/get-store.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer.js";
import { SHOW_EXCEPTION_MODAL_ACTION } from "../exception/exception-modal-reducer.js";
import socketStream from "../socket/socket-stream.js";
import * as fp from "@iml/fp";

type InterstitialComponentProps = {
  title: string,
  message: string
};

const launchCommandModal = () => {
  const commandMonitor$ = socketStream(
    "/command",
    {
      qs: {
        limit: 0,
        errored: false,
        complete: false
      }
    },
    true
  );

  commandMonitor$
    .map(x => x.objects)
    .map(fp.filter(x => x.cancelled === false))
    .stopOnError(e => {
      getStore.dispatch({
        type: SHOW_EXCEPTION_MODAL_ACTION,
        payload: e
      });
    })
    .each(xs => {
      getStore.dispatch({
        type: SHOW_COMMAND_MODAL_ACTION,
        payload: xs
      });
    });
};

class InterstitialComponent extends Component {
  props: InterstitialComponentProps;

  render() {
    return (
      <div class="add-server-section">
        <div class="well">
          <a onClick={launchCommandModal}>
            <h2 class="text-center">{this.props.title}</h2>
          </a>
          <p class="text-center">{this.props.message}</p>
        </div>
      </div>
    );
  }
}
export default InterstitialComponent;

// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";

function PacemakerStateComponent({ state }: stateT) {
  switch (state) {
    case "started":
      return (
        <span>
          <i class="fa fa-plug text-success" /> Pacemaker Started
        </span>
      );
    case "stopped":
      return (
        <span>
          <i class="fa fa-plug text-danger" /> Pacemaker Stopped
        </span>
      );
    case "unconfigured":
      return (
        <span>
          <i class="fa fa-plug" /> Pacemaker Unconfigured
        </span>
      );
    default:
      return <span />;
  }
}

type stateT = { state: string };

export default {
  bindings: {
    stream: "<"
  },
  controller: function($element: HTMLElement[]) {
    "ngInject";
    this.stream
      .filter(Boolean)
      .each(({ state }: stateT) => Inferno.render(<PacemakerStateComponent state={state} />, $element[0]));

    this.$onDestroy = () => this.stream.destroy();
  }
};

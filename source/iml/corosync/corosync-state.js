// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';

type stateT = {
  state:'started'
  | 'stopped'
  | 'unconfigured'
};

function CorosyncStateComponent ({state}:stateT) {
  switch (state) {
  case 'started':
    return (<span>
      <i class="fa fa-plug text-success"></i> Corosync Started
    </span>);
  case 'stopped':
    return (<span>
      <i class="fa fa-plug text-danger"></i> Corosync Stopped
    </span>);
  case 'unconfigured':
    return (<span>
      <i class="fa fa-plug"></i> Unconfigured
    </span>);
  default:
    return <span></span>;
  }
}

export default {
  bindings: {
    stream: '<'
  },
  controller: function ($element:HTMLElement[]) {
    'ngInject';

    this
      .stream
      .filter(Boolean)
      .each(({state}:stateT) =>
        InfernoDOM.render(
          <CorosyncStateComponent state={state} />,
          $element[0]
        )
      );

    this.$onDestroy = () => this.stream.destroy();
  }
};

// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import InfernoDOM from 'inferno-dom';

type statesT =
  | 'lnet_up'
  | 'lnet_down'
  | 'lnet_unloaded'
  | 'configured'
  | 'unconfigured'
  | 'undeployed';

type stateT = {
  state:?statesT
};

function LnetStatusComponent ({state}:stateT) {
  switch (state) {
  case 'lnet_up':
    return (<span>
        <i class="fa fa-plug text-success"></i> LNet Up
      </span>);
  case 'lnet_down':
    return (<span>
        <i class="fa fa-plug text-danger"></i> LNet Down
      </span>);
  case 'lnet_unloaded':
    return (<span>
        <i class="fa fa-plug text-warning"></i> LNet Unloaded
      </span>);
  case 'configured':
    return (<span>
        <i class="fa fa-plug text-info"></i> Configured
      </span>);
  case 'unconfigured':
    return (<span>
      <i class="fa fa-plug"></i> Unconfigured
    </span>);
  case 'undeployed':
    return (<span>
      <i class="fa fa-plug"></i> Undeployed
    </span>);
  case null:
    return (<span>
      <i class="fa fa-plug text-warning"></i> Unknown
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
          <LnetStatusComponent state={state} />,
          $element[0]
        )
      );
  }
};

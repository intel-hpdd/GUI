// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import Inferno from 'inferno';

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
        Inferno.render(
          <LnetStatusComponent state={state} />,
          $element[0]
        )
      );
  }
};

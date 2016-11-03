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
import InfernoDOM from 'inferno-dom';

function PacemakerStateComponent ({state}:stateT) {
  switch (state) {
  case 'started':
    return (<span>
      <i class="fa fa-plug text-success"></i> Pacemaker Started
    </span>);
  case 'stopped':
    return (<span>
      <i class="fa fa-plug text-danger"></i> Pacemaker Stopped
    </span>);
  case 'unconfigured':
    return (<span>
        <i class="fa fa-plug"></i> Pacemaker Unconfigured
      </span>);
  default:
    return <span></span>;
  }
}

type stateT = {state:string};

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
          <PacemakerStateComponent state={state} />,
          $element[0]
        )
      );

    this.$onDestroy = () => this.stream.destroy();
  }
};

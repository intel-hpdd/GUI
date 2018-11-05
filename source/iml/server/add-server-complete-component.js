// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { CSSTransitionGroup } from "inferno-css-transition-group";
import { CompleteStatusComponent } from "./server-status-component.js";
import Spinner from "../spinner.js";
import { type AddServerModalPayloadT } from "./add-server-modal-reducer.js";

const AddServerCompleteComponent = (props: AddServerModalPayloadT) => {
  let clusterStatusTitle = null;
  let spinner = null;
  if (props.testHostsStatus.length > 0 && props.testingHosts === false)
    clusterStatusTitle = <h2 class="server-status-header">Cluster Status</h2>;
  else
    spinner = (
      <div class="text-center">
        <Spinner display={true} />
      </div>
    );

  return (
    <>
      <div class="add-server-section">
        <h3 class="text-center">Add Server Results:</h3>
      </div>
      <CSSTransitionGroup transitionName="ng" transitionEnterTimeout={500} transitionLeaveTimeout={500} component="div">
        {spinner}
        {clusterStatusTitle}
      </CSSTransitionGroup>
      <div class="add-server-section">
        <CompleteStatusComponent hosts={props.testHostsStatus} />
      </div>
    </>
  );
};

export default AddServerCompleteComponent;

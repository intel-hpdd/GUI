// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import uiBootstrapModule from "angular-ui-bootstrap";

import ServerCtrl from "./server-controller";
import serverActionsFactory from "./server-actions";
import ConfirmServerActionModalCtrl from "./confirm-server-action-modal-ctrl";
import { ADD_SERVER_AUTH_CHOICES, AddServerStepCtrl, addServersStepFactory } from "./add-server-step";
import { SelectServerProfileStepCtrl, selectServerProfileStep } from "./select-server-profile-step";
import ServerDetailController from "./server-detail-controller";
import filtersModule from "../filters/filters-module";
import lnetModule from "../lnet/lnet-module";
import corosyncModule from "../corosync/corosync-module";
import pacemakerModule from "../pacemaker/pacemaker-module";
import commandModule from "../command/command-module";
import actionDropdownModule from "../action-dropdown/action-dropdown-module";
import stepsModule from "../steps/steps-module";
import extendScopeModule from "../extend-scope-module";
import highlandModule from "../highland/highland-module";
import asValueModule from "../as-value/as-value-module";
import asStreamModule from "../as-stream/as-stream-module";
import SelectedServersService from "./selected-servers-service";
import { AddServerModalCtrl, openAddServerModalFactory } from "./add-server-modal-ctrl";
import overrideActionClickFactory from "./override-action-click";
import overrideButtonDirective from "./override-button-directive";

import { addServerStepsFactory, getAddServerManagerFactory } from "./get-add-server-manager";
import getTestHostStreamFactory from "./get-test-host-stream";
import hostlistFilterFactory from "./hostlist-filter";
import { ServerStatusStepCtrl, serverStatusStep } from "./server-status-step";
import { waitUntilLoadedCtrl, waitUntilLoadedStep } from "./wait-until-loaded-step";
import serversToApiObjects from "./servers-to-api-objects";
import createOrUpdateHostsStream from "./create-or-update-hosts-stream";

export default angular
  .module("server", [
    filtersModule,
    lnetModule,
    corosyncModule,
    pacemakerModule,
    commandModule,
    actionDropdownModule,
    stepsModule,
    extendScopeModule,
    highlandModule,
    asValueModule,
    asStreamModule,
    uiBootstrapModule
  ])
  .constant("OVERRIDE_BUTTON_TYPES", {
    OVERRIDE: "override",
    PROCEED: "proceed",
    PROCEED_SKIP: "proceed and skip"
  })
  .constant("ADD_SERVER_STEPS", {
    ADD: "addServersStep",
    STATUS: "serverStatusStep",
    SELECT_PROFILE: "selectServerProfileStep"
  })
  .controller("ServerCtrl", ServerCtrl)
  .controller("ConfirmServerActionModalCtrl", ConfirmServerActionModalCtrl)
  .factory("serverActions", serverActionsFactory)
  .constant("ADD_SERVER_AUTH_CHOICES", ADD_SERVER_AUTH_CHOICES)
  .controller("AddServerStepCtrl", AddServerStepCtrl)
  .factory("addServersStep", addServersStepFactory)
  .controller("SelectServerProfileStepCtrl", SelectServerProfileStepCtrl)
  .factory("selectServerProfileStep", selectServerProfileStep)
  .controller("ServerDetailController", ServerDetailController)
  .controller("AddServerModalCtrl", AddServerModalCtrl)
  .service("selectedServers", SelectedServersService)
  .factory("openAddServerModal", openAddServerModalFactory)
  .factory("overrideActionClick", overrideActionClickFactory)
  .directive("overrideButton", overrideButtonDirective)
  .factory("addServerSteps", addServerStepsFactory)
  .value("createOrUpdateHostsStream", createOrUpdateHostsStream)
  .factory("getAddServerManager", getAddServerManagerFactory)
  .factory("getTestHostStream", getTestHostStreamFactory)
  .factory("hostlistFilter", hostlistFilterFactory)
  .controller("ServerStatusStepCtrl", ServerStatusStepCtrl)
  .value("serverStatusStep", serverStatusStep)
  .controller("WaitUntilLoadedCtrl", waitUntilLoadedCtrl)
  .factory("waitUntilLoadedStep", waitUntilLoadedStep)
  .value("serversToApiObjects", serversToApiObjects).name;

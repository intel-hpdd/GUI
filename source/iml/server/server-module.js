// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import uiBootstrapModule from "angular-ui-bootstrap";
import { render } from "inferno";

import ServerCtrl from "./server-controller";
import serverActionsFactory from "./server-actions";
import ConfirmServerActionModalCtrl from "./confirm-server-action-modal-ctrl";
import { ADD_SERVER_AUTH_CHOICES, AddServerStepCtrl, addServersStepFactory } from "./add-server-step";
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
import overrideButtonDirective from "./override-button-directive";
import global from "../global.js";
import { querySelector } from "../dom-utils";

import { waitUntilLoadedCtrl, waitUntilLoadedStep } from "./wait-until-loaded-step";
import serversToApiObjects from "./servers-to-api-objects";
import createOrUpdateHostsStream from "./create-or-update-hosts-stream";
import getStore from "../store/get-store.js";
import { default as AddServerModal } from "./add-server-modal.js";
import {
  type AddServerModalPayloadT,
  ADD_SERVER_MODAL_RESET_STATE,
  ADD_SERVER_MODAL_QUERY_SERVER_STEP,
  ADD_SERVER_MODAL_INTERSTITIAL_STEP
} from "../server/add-server-modal-reducer.js";
import { type AuthTypesT } from "./server-authorization-component.js";

export const ADD_SERVER_STEPS = {
  ADD: "addServersStep",
  SELECT_PROFILE: "selectServerProfileStep"
};

export type StepT = "addServerStep" | "selectServerProfileStep";
export type AvailableActionT = {
  args: {
    host_id: number
  },
  class_name: ?string,
  confirmation: ?string,
  display_group: number,
  display_order: number,
  long_description: string,
  verb: string,
  last: ?boolean
};

export const HOST_STATE_UNDEPLOYED: "undeployed" = "undeployed";
export const HOST_STATE_UNCONFIGURED: "unconfigured" = "unconfigured";
export const HOST_STATE_PACKAGES_INSTALLED: "packages_installed" = "packages_installed";
export const HOST_STATE_MANAGED: "managed" = "managed";
export const HOST_STATE_MONITORED: "monitored" = "monitored";
export const HOST_STATE_WORKING: "working" = "working";
export const HOST_STATE_REMOVED: "removed" = "removed";

export type HostStatesT =
  | typeof HOST_STATE_UNDEPLOYED
  | typeof HOST_STATE_UNCONFIGURED
  | typeof HOST_STATE_PACKAGES_INSTALLED
  | typeof HOST_STATE_MANAGED
  | typeof HOST_STATE_MONITORED
  | typeof HOST_STATE_WORKING
  | typeof HOST_STATE_REMOVED;

export type HostT = {
  address: string,
  fqdn: string,
  id: number,
  available_actions: AvailableActionT[],
  label: string,
  state: HostStatesT,
  server_profile?: {
    initial_state: "string"
  },
  install_method: "string",
  locks: { write: number[], read: number[] }
};

export type ServerStatusT = {
  name:
    | "resolve"
    | "ping"
    | "auth"
    | "hostname_valid"
    | "fqdn_resolves"
    | "fqdn_matches"
    | "reverse_resolve"
    | "reverse_ping"
    | "yum_can_update"
    | "openssl",
  value: boolean,
  uiName:
    | "Resolve"
    | "Ping"
    | "Auth"
    | "Hostname valid"
    | "Fqdn resolves"
    | "Fqdn matches"
    | "Reverse resolve"
    | "Reverse ping"
    | "Yum can update"
    | "Openssl"
};

export type ProfileProblemT = {
  test: string,
  error: string,
  description: string
};

export type ProfileHostT = {|
  address: string,
  invalid: boolean,
  problems: ProfileProblemT[],
  uiName: string
|};

export type ProfileT = {
  hosts: ProfileHostT[],
  invalid: boolean,
  name: string,
  uiName: string
};

export type TestHostT = {|
  address: string,
  status: ServerStatusT[],
  deployed?: boolean,
  state?: HostStatesT,
  valid: boolean
|};

export type ServerToApiT = {|
  addresses: string[],
  auth_type: AuthTypesT,
  root_password?: string,
  private_key?: string,
  private_key_passphrase?: string
|};

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
  .constant("ADD_SERVER_STEPS", ADD_SERVER_STEPS)
  .controller("ServerCtrl", ServerCtrl)
  .controller("ConfirmServerActionModalCtrl", ConfirmServerActionModalCtrl)
  .factory("serverActions", serverActionsFactory)
  .constant("ADD_SERVER_AUTH_CHOICES", ADD_SERVER_AUTH_CHOICES)
  .controller("AddServerStepCtrl", AddServerStepCtrl)
  .factory("addServersStep", addServersStepFactory)
  .controller("ServerDetailController", ServerDetailController)
  .service("selectedServers", SelectedServersService)
  .directive("overrideButton", overrideButtonDirective)
  .value("createOrUpdateHostsStream", createOrUpdateHostsStream)
  .controller("WaitUntilLoadedCtrl", waitUntilLoadedCtrl)
  .factory("waitUntilLoadedStep", waitUntilLoadedStep)
  .value("serversToApiObjects", serversToApiObjects).name;

export const getDeployedServers = (servers: HostT[]): string[] => {
  return servers
    .map(x => {
      if (
        x.state === HOST_STATE_UNCONFIGURED ||
        x.state === HOST_STATE_MONITORED ||
        x.state === HOST_STATE_MANAGED ||
        x.state === HOST_STATE_WORKING
      )
        return x.address;
      return "";
    })
    .filter(x => x !== "");
};

const addServerContainer = document.createElement("div");
const body = querySelector(global.document, "body");
getStore.select("addServerModal").each((state: AddServerModalPayloadT) => {
  const containerOnBody = body.contains(addServerContainer);

  if (state.open === false && containerOnBody === true) {
    render(null, addServerContainer);
    body.removeChild(addServerContainer);

    getStore.dispatch({
      type: ADD_SERVER_MODAL_RESET_STATE,
      payload: {}
    });
  } else if (state.open === true && containerOnBody === false) {
    body.appendChild(addServerContainer);
    render(<AddServerModal />, addServerContainer);

    if (state.step !== ADD_SERVER_MODAL_INTERSTITIAL_STEP)
      getStore.dispatch({
        type: ADD_SERVER_MODAL_QUERY_SERVER_STEP,
        payload: {}
      });
  }
});

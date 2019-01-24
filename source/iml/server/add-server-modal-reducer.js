// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export const ADD_SERVER_MODAL_SHOW_MODAL: "ADD_SERVER_MODAL_SHOW_MODAL" = "ADD_SERVER_MODAL_SHOW_MODAL";
export const ADD_SERVER_MODAL_CLOSE_MODAL: "ADD_SERVER_MODAL_CLOSE_MODAL" = "ADD_SERVER_MODAL_CLOSE_MODAL";
export const ADD_SERVER_MODAL_UPDATE_SERVERS: "ADD_SERVER_MODAL_UPDATE_SERVERS" = "ADD_SERVER_MODAL_UPDATE_SERVERS";
export const ADD_SERVER_MODAL_UPDATE_TEST_HOST: "ADD_SERVER_MODAL_UPDATE_TEST_HOST" =
  "ADD_SERVER_MODAL_UPDATE_TEST_HOST";
export const ADD_SERVER_MODAL_CLEAR_EXPRESSION: "ADD_SERVER_MODAL_CLEAR_EXPRESSION" =
  "ADD_SERVER_MODAL_CLEAR_EXPRESSION";
export const ADD_SERVER_MODAL_SET_EXPRESSION: "ADD_SERVER_MODAL_SET_EXPRESSION" = "ADD_SERVER_MODAL_SET_EXPRESSION";
export const ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS: "ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS" =
  "ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS";
export const ADD_SERVER_MODAL_SET_AUTH_DATA: "ADD_SERVER_MODAL_SET_AUTH_DATA" = "ADD_SERVER_MODAL_SET_AUTH_DATA";
export const ADD_SERVER_MODAL_SET_PROFILES: "ADD_SERVER_MODAL_SET_PROFILES" = "ADD_SERVER_MODAL_SET_PROFILES";
export const ADD_SERVER_MODAL_SET_SELECTED_PROFILE: "ADD_SERVER_MODAL_SET_SELECTED_PROFILE" =
  "ADD_SERVER_MODAL_SET_SELECTED_PROFILE";
export const ADD_SERVER_MODAL_START_TRANSITION: "ADD_SERVER_MODAL_START_TRANSITION" =
  "ADD_SERVER_MODAL_START_TRANSITION";
export const ADD_SERVER_MODAL_END_TRANSITION: "ADD_SERVER_MODAL_END_TRANSITION" = "ADD_SERVER_MODAL_END_TRANSITION";

export const ADD_SERVER_MODAL_INTERSTITIAL_STEP: "ADD_SERVER_MODAL_INTERSTITIAL_STEP" =
  "ADD_SERVER_MODAL_INTERSTITIAL_STEP";
export const ADD_SERVER_MODAL_QUERY_SERVER_STEP: "ADD_SERVER_MODAL_QUERY_SERVER_STEP" =
  "ADD_SERVER_MODAL_QUERY_SERVER_STEP";
export const ADD_SERVER_MODAL_SELECT_PROFILE_STEP: "ADD_SERVER_MODAL_SELECT_PROFILE_STEP" =
  "ADD_SERVER_MODAL_SELECT_PROFILE_STEP";
export const ADD_SERVER_MODAL_COMPLETE_STEP: "ADD_SERVER_MODAL_COMPLETE_STEP" = "ADD_SERVER_MODAL_COMPLETE_STEP";
export const ADD_SERVER_MODAL_RESET_STATE: "ADD_SERVER_MODAL_RESET_STATE" = "ADD_SERVER_MODAL_RESET_STATE";
export const ADD_SERVER_MODAL_DEPLOY_AGENT_FAILED: "ADD_SERVER_MODAL_DEPLOY_AGENT_FAILED" =
  "ADD_SERVER_MODAL_DEPLOY_AGENT_FAILED";
export const ADD_SERVER_MODAL_CONFIRM_PROCEED: "ADD_SERVER_MODAL_CONFIRM_PROCEED" = "ADD_SERVER_MODAL_CONFIRM_PROCEED";

import Immutable from "seamless-immutable";

import { type AuthTypesT, AUTHORIZATION_TYPES } from "./server-authorization-component.js";
import { type ProfileT, type HostT, type TestHostT } from "./server-module.js";

export type ModalOpenPayloadT = {|
  open: boolean
|};

export type OpenServerModalT = {|
  type: typeof ADD_SERVER_MODAL_SHOW_MODAL,
  payload: {||}
|};

export type CloseServerModalT = {|
  type: typeof ADD_SERVER_MODAL_CLOSE_MODAL,
  payload: {||}
|};

export type QueryServerStepT = {|
  type: typeof ADD_SERVER_MODAL_QUERY_SERVER_STEP,
  payload: {||}
|};

export type SetAuthDataPayloadT = {|
  privateKey?: string,
  privateKeyPassphrase?: string,
  rootPassword?: string,
  authType?: AuthTypesT
|};

export type SetAuthDataT = {|
  type: typeof ADD_SERVER_MODAL_SET_AUTH_DATA,
  payload: SetAuthDataPayloadT
|};

export type ClearExpressionT = {|
  type: typeof ADD_SERVER_MODAL_CLEAR_EXPRESSION,
  payload: {||}
|};

export type SetExpressionPayloadT = {|
  addresses: string[],
  pdshExpression: string
|};

export type SetExpressionT = {|
  type: typeof ADD_SERVER_MODAL_SET_EXPRESSION,
  payload: SetExpressionPayloadT
|};

export type UpdateServersPayloadT = {|
  servers: HostT[],
  deployedServers: string[]
|};

export type UpdateServersT = {|
  type: typeof ADD_SERVER_MODAL_UPDATE_SERVERS,
  payload: UpdateServersPayloadT
|};

export type UpdateTestHostPayloadT = {|
  testHostsStatus: TestHostT[],
  deployableAddresses: string[],
  testingHosts: boolean
|};

export type UpdateTestHostT = {|
  type: typeof ADD_SERVER_MODAL_UPDATE_TEST_HOST,
  payload: UpdateTestHostPayloadT
|};

export type SetResetTestHostsPayloadT = {|
  resetTestsHosts: boolean
|};

export type SetResetTestHostsT = {|
  type: typeof ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS,
  payload: SetResetTestHostsPayloadT
|};

export type InterstitialPayloadT = {|
  title: string,
  message: string
|};

export type InterstitialStepT = {|
  type: typeof ADD_SERVER_MODAL_INTERSTITIAL_STEP,
  payload: InterstitialPayloadT
|};

export type SetProfilesPayloadT = {|
  profiles: ProfileT[]
|};

export type SetProfilesT = {|
  type: typeof ADD_SERVER_MODAL_SET_PROFILES,
  payload: SetProfilesPayloadT
|};

export type SetSelectedProfilePayloadT = {|
  selectedProfile: ProfileT
|};

export type SetSelectedProfileT = {|
  type: typeof ADD_SERVER_MODAL_SET_SELECTED_PROFILE,
  payload: SetSelectedProfilePayloadT
|};

export type SelectProfileStepT = {|
  type: typeof ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
  payload: {||}
|};

export type SetProceedButtonPayloadT = {|
  disabled: boolean,
  showSpinner: boolean,
  visible: boolean
|};

export type ConfirmProceedPayloadT = {|
  confirmProceed: boolean
|};

export type ConfirmProceedT = {|
  type: typeof ADD_SERVER_MODAL_CONFIRM_PROCEED,
  payload: ConfirmProceedPayloadT
|};

export type StartTransitionT = {|
  type: typeof ADD_SERVER_MODAL_START_TRANSITION,
  payload: {||}
|};

export type EndTransitionT = {|
  type: typeof ADD_SERVER_MODAL_END_TRANSITION,
  payload: {||}
|};

export type CompleteStepT = {|
  type: typeof ADD_SERVER_MODAL_COMPLETE_STEP,
  payload: {||}
|};

export type ResetStatePayloadT = {|
  open?: boolean,
  step?: StepsT,
  servers?: HostT[],
  pdshExpression?: string,
  deployedServers?: string[],
  testHostsStatus?: TestHostT[],
  deployableAddresses?: string[],
  resetTestHosts?: boolean,
  canTestHosts?: boolean,
  testingHosts?: boolean,
  addresses?: string[],
  authType?: AuthTypesT,
  rootPassword?: string,
  privateKey?: string,
  privateKeyPassphrase?: string,
  profiles?: ProfileT[],
  selectedProfile?: ProfileT,
  title?: string,
  message?: string,
  proceedButton?: SetProceedButtonPayloadT,
  closeX?: boolean,
  closeButton?: boolean,
  transition?: boolean,
  modalTitle?: string,
  modalTooltip?: string,
  confirmProceed?: boolean
|};

export type ResetStateT = {|
  type: typeof ADD_SERVER_MODAL_RESET_STATE,
  payload: ResetStatePayloadT
|};

export type AddServerModalActionsT =
  | OpenServerModalT
  | CloseServerModalT
  | SetAuthDataT
  | ClearExpressionT
  | SetExpressionT
  | UpdateServersT
  | UpdateTestHostT
  | SetResetTestHostsT
  | SetProfilesT
  | StartTransitionT
  | EndTransitionT
  | SetSelectedProfileT
  | ResetStateT
  | ConfirmProceedT
  | QueryServerStepT
  | SelectProfileStepT
  | CompleteStepT
  | InterstitialStepT;

export type StepsT =
  | typeof ADD_SERVER_MODAL_QUERY_SERVER_STEP
  | typeof ADD_SERVER_MODAL_SELECT_PROFILE_STEP
  | typeof ADD_SERVER_MODAL_COMPLETE_STEP
  | typeof ADD_SERVER_MODAL_INTERSTITIAL_STEP;

export type AddServerModalPayloadT = {|
  open: boolean,
  step: StepsT,
  servers: HostT[],
  pdshExpression: string,
  deployedServers: string[],
  testHostsStatus: TestHostT[],
  deployableAddresses: string[],
  resetTestHosts: boolean,
  canTestHosts: boolean,
  testingHosts: boolean,
  addresses: string[],
  authType: AuthTypesT,
  rootPassword: string,
  privateKey: string,
  privateKeyPassphrase: string,
  profiles: ProfileT[],
  selectedProfile?: ProfileT,
  title: string,
  message: string,
  proceedButton: SetProceedButtonPayloadT,
  closeX: boolean,
  closeButton: boolean,
  transition: boolean,
  modalTitle: string,
  modalTooltip: string,
  confirmProceed: boolean
|};

const getDefaultState = () =>
  Immutable({
    open: false,
    step: ADD_SERVER_MODAL_QUERY_SERVER_STEP,
    servers: [],
    pdshExpression: "",
    deployedServers: [],
    testHostsStatus: [],
    deployableAddresses: [],
    resetTestHosts: false,
    canTestHosts: false,
    testingHosts: false,
    addresses: [],
    authType: AUTHORIZATION_TYPES.EXISTING_KEYS,
    rootPassword: "",
    privateKey: "",
    privateKeyPassphrase: "",
    profiles: [],
    selectedProfile: null,
    title: "",
    message: "",
    proceedButton: {
      disabled: true,
      showSpinner: false,
      visible: true
    },
    closeX: false,
    closeButton: false,
    transition: false,
    modalTitle: "",
    modalTooltip: "",
    confirmProceed: false
  });

const disabledProceedButton: SetProceedButtonPayloadT = {
  disabled: true,
  showSpinner: false,
  visible: true
};

const spinningProceedButton: SetProceedButtonPayloadT = {
  disabled: true,
  showSpinner: true,
  visible: true
};

const enabledProceedButton: SetProceedButtonPayloadT = {
  disabled: false,
  showSpinner: false,
  visible: true
};

const hiddenProceedButton: SetProceedButtonPayloadT = {
  disabled: true,
  showSpinner: false,
  visible: false
};

const getProceedButton = (state: AddServerModalPayloadT) => {
  switch (state.step) {
    case ADD_SERVER_MODAL_QUERY_SERVER_STEP:
      if (state.testingHosts === true) return { ...spinningProceedButton };
      else if (
        state.testHostsStatus.length > 0 &&
        state.testHostsStatus.every(
          server =>
            (server.valid === true && (server.deployed == null || server.deployed === false)) ||
            (server.valid === true && (server.state === "unconfigured" || server.state === "undeployed")) ||
            (server.state != null &&
              server.state !== "unconfigured" &&
              server.state !== "undeployed" &&
              server.state !== "removed")
        ) &&
        state.testHostsStatus.some(
          server =>
            server.state == null ||
            server.state === "unconfigured" ||
            server.state === "undeployed" ||
            server.state === "removed"
        )
      )
        return { ...enabledProceedButton };
      else return { ...disabledProceedButton };
    case ADD_SERVER_MODAL_SELECT_PROFILE_STEP:
      if (state.testingHosts === true) return { ...spinningProceedButton };
      else return { ...enabledProceedButton };
    case ADD_SERVER_MODAL_COMPLETE_STEP:
      return { ...hiddenProceedButton };
    case ADD_SERVER_MODAL_INTERSTITIAL_STEP:
      return { ...spinningProceedButton };
  }
};

export default function(
  state: AddServerModalPayloadT = getDefaultState(),
  action: AddServerModalActionsT
): AddServerModalPayloadT {
  let mergedState: AddServerModalPayloadT;
  switch (action.type) {
    case ADD_SERVER_MODAL_SHOW_MODAL:
      mergedState = Immutable.merge(state, { ...action.payload, open: true });
      break;
    case ADD_SERVER_MODAL_CLOSE_MODAL:
      mergedState = Immutable.merge(state, { ...action.payload, open: false });
      break;
    case ADD_SERVER_MODAL_CLEAR_EXPRESSION:
      mergedState = Immutable.merge(state, {
        addresses: [],
        testHostsStatus: [],
        testingHosts: false,
        resetTestHosts: true
      });
      break;
    case ADD_SERVER_MODAL_SET_EXPRESSION:
    case ADD_SERVER_MODAL_SET_AUTH_DATA:
      mergedState = Immutable.merge(state, {
        ...action.payload,
        resetTestHosts: true
      });
      break;
    case ADD_SERVER_MODAL_START_TRANSITION:
      mergedState = Immutable.merge(state, {
        transition: true
      });
      break;
    case ADD_SERVER_MODAL_END_TRANSITION:
      mergedState = Immutable.merge(state, {
        transition: false
      });
      break;
    case ADD_SERVER_MODAL_QUERY_SERVER_STEP:
      mergedState = Immutable.merge(state, {
        step: ADD_SERVER_MODAL_QUERY_SERVER_STEP,
        closeX: true,
        closeButton: false,
        modalTitle: "Add Server - Add New Servers",
        modalTooltip: "Use the Hostlist Expression input below to add multiple hosts.",
        canTestHosts: true
      });
      break;
    case ADD_SERVER_MODAL_SELECT_PROFILE_STEP:
      mergedState = Immutable.merge(state, {
        step: ADD_SERVER_MODAL_SELECT_PROFILE_STEP,
        closeX: false,
        closeButton: false,
        modalTitle: "Add Server - Add Server Profiles",
        modalTooltip:
          "Select the server profile to be applied to all servers. Green squares represent servers that are compatible with the selected profile. Red squares represent servers that are incompatible with the selected server profile.",
        canTestHosts: false
      });
      break;
    case ADD_SERVER_MODAL_COMPLETE_STEP:
      mergedState = Immutable.merge(state, {
        step: ADD_SERVER_MODAL_COMPLETE_STEP,
        closeX: true,
        closeButton: true,
        modalTitle: "Add Server - Results",
        modalTooltip:
          "The results of adding the profiles are displayed below. Green squares represent servers in which the profiles were added successfully. Red squares represent servers in which adding the profiles did not succeed.",
        canTestHosts: false
      });
      break;
    case ADD_SERVER_MODAL_INTERSTITIAL_STEP:
      mergedState = Immutable.merge(state, {
        ...action.payload,
        transition: false,
        step: ADD_SERVER_MODAL_INTERSTITIAL_STEP,
        closeX: false,
        closeButton: false,
        modalTitle: "Add Server - Processing...",
        modalTooltip: "Please wait until the transition completes.",
        canTestHosts: false
      });
      break;
    case ADD_SERVER_MODAL_UPDATE_SERVERS:
      mergedState = Immutable.merge(state, {
        ...action.payload,
        resetTestHosts: true
      });
      break;
    case ADD_SERVER_MODAL_RESET_STATE:
      mergedState = Immutable.merge(getDefaultState(), action.payload);
      break;
    case ADD_SERVER_MODAL_CONFIRM_PROCEED:
    case ADD_SERVER_MODAL_UPDATE_TEST_HOST:
    case ADD_SERVER_MODAL_SET_RESET_TEST_HOSTS:
    case ADD_SERVER_MODAL_SET_SELECTED_PROFILE:
    case ADD_SERVER_MODAL_SET_PROFILES:
      mergedState = Immutable.merge(state, action.payload);
      break;
    default:
      mergedState = state;
  }

  const proceedButton = Immutable(getProceedButton(mergedState));

  mergedState = Immutable.merge(mergedState, { proceedButton });
  return mergedState;
}

//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from "@iml/lodash-mixins";

import socketStream from "../socket/socket-stream.js";
import getStore from "../store/get-store.js";
import { openAddServerModal } from "../listeners.js";

import { type SelectedActionT } from "./action-dropdown-module.js";

import { CONFIRM_ACTION } from "./confirm-action-reducer.js";
import { ADD_SERVER_STEPS } from "../server/server-module.js";
import { SHOW_COMMAND_MODAL_ACTION } from "../command/command-modal-reducer";

export default function handleActionFactory() {
  "ngInject";

  return handleAction;
}

/**
 * Performs the given action
 * @param {Object} action
 * @param {String} label
 * @returns {Highland.Stream}
 */
export function handleAction(action, label, resourceUri) {
  let method;

  if (action.class_name) method = executeJob;
  else if (action.param_key) method = setConfParam;
  else method = changeState;

  return method(socketStream, action, label, resourceUri);
}

const filterArgs = (args: Object): Object =>
  Object.entries(args)
    .filter(([, val]) => val != null)
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

/**
 * Executes a job on a record.
 * @param {Object} socketStream
 * @param {String} label
 * @param  {Object} action
 * @returns {Object}
 */
function executeJob(socketStream, action, label) {
  const message = `${action.verb}(${label})`;
  let { class_name: className, args } = action;

  args = filterArgs(args);
  const jobSender = _.partial(
    socketStream,
    "/command",
    {
      method: "post",
      json: {
        jobs: [{ class_name: className, args }],
        message: message
      }
    },
    true
  );

  getStore.dispatch({
    type: CONFIRM_ACTION,
    payload: {
      action: jobSender,
      message: message,
      prompts: [action.confirmation],
      required: action.confirmation,
      label
    }
  });
}

/**
 * Executes a state change on a record.
 * @param {Object} socketStream
 * @param {String} label
 * @param {Object} action
 * @returns {Object}
 */
function changeState(socketStream, action, label, resourceUri) {
  const sendStateChange = _.partial(function sendStateChange(isDryRun) {
    const data = {
      method: "put",
      json: { state: action.state }
    };

    if (isDryRun) data.json.dry_run = true;

    return socketStream(resourceUri, data, true);
  });

  return sendStateChange(true)
    .filter(function filterEmpty(x) {
      return x.transition_job != null;
    })
    .map(function buildConfirmInfo(x) {
      const confirm = {
        action: sendStateChange,
        message: x.transition_job.description,
        prompts: [],
        required: false
      };

      if (x.dependency_jobs.length > 0) {
        confirm.prompts = x.dependency_jobs.map(function buildPrompts(job) {
          if (job.requires_confirmation) confirm.required = true;

          return job.description;
        });
      } else if (x.transition_job.confirmation_prompt) {
        confirm.required = true;
        confirm.prompts.push(x.transition_job.confirmation_prompt);
      } else {
        confirm.required = x.transition_job.requires_confirmation;
      }

      return confirm;
    })
    .each(confirm => {
      getStore.dispatch({
        type: CONFIRM_ACTION,
        payload: {
          ...confirm,
          label
        }
      });
    });
}

/**
 * Sets a conf param key value pair and sends it.
 * @param {Object} socketStream
 * @param {Object} action
 * @returns {Highland.Stream}
 */
function setConfParam(socketStream, action) {
  const mdt = action.mdt;

  mdt.conf_params[action.param_key] = action.param_value;

  const path = `/${mdt.resource}/${mdt.id}`;

  return socketStream(
    path,
    {
      method: "put",
      json: mdt
    },
    true
  ).each(({ command }) => {
    getStore.dispatch({
      type: SHOW_COMMAND_MODAL_ACTION,
      payload: [command]
    });
  });
}

export function handleCheckDeployPredicate(action: SelectedActionT, state: string, serverProfile: ?Object) {
  const notRemoving = action.state && action.state !== "removed" && action.verb !== "Force Remove";
  const openForDeploy = state === "undeployed";
  const openForConfigure = serverProfile && serverProfile.initial_state === "unconfigured";

  return (openForDeploy || openForConfigure) && notRemoving;
}

export function handleCheckDeploy(record) {
  const openForDeploy = record.state === "undeployed";

  let step;
  if (record.install_method !== "existing_keys_choice") step = ADD_SERVER_STEPS.ADD;
  else if (openForDeploy) step = ADD_SERVER_STEPS.STATUS;
  else step = ADD_SERVER_STEPS.SELECT_PROFILE;

  return openAddServerModal(record, step);
}

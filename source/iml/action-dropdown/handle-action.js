//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';

import socketStream from '../socket/socket-stream.js';

export default function handleActionFactory(openConfirmActionModal) {
  'ngInject';
  /**
   * Performs the given action
   * @param {Object} record
   * @param {Object} action
   * @returns {Highland.Stream}
   */
  return function handleAction(record, action) {
    let method;

    if (action.class_name) method = executeJob;
    else if (action.param_key) method = setConfParam;
    else method = changeState;

    return method(socketStream, record, action);
  };

  /**
   * Executes a job on a record.
   * @param {Object} socketStream
   * @param {Object} record
   * @param  {Object} action
   * @returns {Object}
   */
  function executeJob(socketStream, record, action) {
    const message = `${action.verb}(${record.label})`;

    const jobSender = _.partial(
      socketStream,
      '/command',
      {
        method: 'post',
        json: {
          jobs: [_.pick(action, 'class_name', 'args')],
          message: message
        }
      },
      true
    );

    return confirmAction({
      action: jobSender,
      message: message,
      prompts: [action.confirmation],
      required: action.confirmation
    });
  }

  /**
   * Executes a state change on a record.
   * @param {Object} socketStream
   * @param {Object} record
   * @param {Object} action
   * @returns {Object}
   */
  function changeState(socketStream, record, action) {
    const sendStateChange = _.partial(function sendStateChange(isDryRun) {
      const data = {
        method: 'put',
        json: { state: action.state }
      };

      if (isDryRun) data.json.dry_run = true;

      return socketStream(record.resource_uri, data, true);
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
      .flatMap(confirmAction);
  }

  /**
   * Sets a conf param key value pair and sends it.
   * @param {Object} socketStream
   * @param {Object} record
   * @param {Object} action
   * @returns {Highland.Stream}
   */
  function setConfParam(socketStream, record, action) {
    record = action.mdt;

    record.conf_params[action.param_key] = action.param_value;

    const path = `/${record.resource}/${record.id}`;

    return socketStream(
      path,
      {
        method: 'put',
        json: record
      },
      true
    );
  }

  /**
   * Opens the command modal. If the user resolves we determine whether we should return
   * the action data.
   * @param {{ action: String, message: String, prompts: [], required: Boolean }} confirm
   * @returns {Highland.Stream}
   */
  function confirmAction(confirm) {
    if (!confirm.required) return confirm.action();

    return openConfirmActionModal(confirm.message, confirm.prompts)
      .resultStream.errors(function handleCancel(err, push) {
        if (err === 'cancel') return;

        push(err);
      })
      .filter(_.isBoolean)
      .flatMap(function runAction(skip) {
        const sendDataIfNotSkipping = _.if(_.fidentity(!skip), _.identity);

        return confirm.action().map(sendDataIfNotSkipping);
      });
  }
}

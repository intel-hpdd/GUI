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

import angular from 'angular';

angular.module('action-dropdown-module').factory('handleAction',
  ['socketStream', 'openConfirmActionModal', function handleActionFactory (socketStream, openConfirmActionModal) {
    'use strict';

    /**
     * Performs the given action
     * @param {Object} record
     * @param {Object} action
     * @returns {Highland.Stream}
     */
    return function handleAction (record, action) {
      var method;

      if (action.class_name)
        method = executeJob;
      else if (action.param_key)
        method = setConfParam;
      else
        method = changeState;

      return method(socketStream, record, action);
    };

    /**
     * Executes a job on a record.
     * @param {Object} socketStream
     * @param {Object} record
     * @param  {Object} action
     * @returns {Object}
     */
    function executeJob (socketStream, record, action) {
      var message = '%s(%s)'.sprintf(action.verb, record.label);

      var jobSender = _.partial(socketStream, '/command', {
        method: 'post',
        json: {
          jobs: [_.pick(action, 'class_name', 'args')],
          message: message
        }
      }, true);

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
    function changeState (socketStream, record, action) {
      var sendStateChange = _.partial(function sendStateChange (isDryRun) {
        var data = {
          method: 'put',
          json: { state: action.state }
        };

        if (isDryRun)
          data.json.dry_run = true;

        return socketStream(record.resource_uri, data, true);
      });

      return sendStateChange(true)
        .filter(function filterEmpty (x) {
          return x.transition_job != null;
        })
        .map(function buildConfirmInfo (x) {
          var confirm = {
            action: sendStateChange,
            message: x.transition_job.description,
            prompts: [],
            required: false
          };

          if (x.dependency_jobs.length > 0) {
            confirm.prompts = x.dependency_jobs.map(function buildPrompts (job) {
              if (job.requires_confirmation)
                confirm.required = true;

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
    function setConfParam (socketStream, record, action) {
      record = action.mdt;

      record.conf_params[action.param_key] = action.param_value;

      var path = '/%s/%s'.sprintf(record.resource, record.id);

      return socketStream(path, {
        method: 'put',
        json: record
      }, true);
    }

    /**
     * Opens the command modal. If the user resolves we determine whether we should return
     * the action data.
     * @param {{ action: String, message: String, prompts: [], required: Boolean }} confirm
     * @returns {Highland.Stream}
     */
    function confirmAction (confirm) {
      if (!confirm.required)
        return confirm.action();

      return openConfirmActionModal(confirm.message, confirm.prompts).resultStream
        .errors(function handleCancel (err, push) {
          if (err === 'cancel')
            return;

          push(err);
        })
        .filter(_.isBoolean)
        .flatMap(function runAction (skip) {
          var sendDataIfNotSkipping = _.if(_.fidentity(!skip), _.identity);

          return confirm.action()
            .map(sendDataIfNotSkipping);
        });
    }
  }]
);

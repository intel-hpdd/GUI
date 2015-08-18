//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2014 Intel Corporation All Rights Reserved.
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

angular.module('command')
  .factory('getCommandStream', ['socketStream', 'COMMAND_STATES',
    function getCommandStreamFactory (socketStream, COMMAND_STATES) {
      'use strict';

      var findId = /\/(\d+)\/$/;

      /**
       * Creates and returns a command stream.
       * @param {Array} commandList
       * @returns {Highland.Stream}
       */
      return function getCommandStream (commandList) {
        var options = {
          qs: {
            id__in: _.pluck(commandList, 'id')
          }
        };

        var stream = socketStream('/command', options);

        stream.write({ objects: commandList });

        var s2 = stream
          .pluck('objects')
          .map(_.fmap(transform));

        s2.destroy = stream.destroy.bind(stream);

        return s2;

        /**
         * Does some data munging on a command object
         * @param {Object} command
         * @returns {Object}
         */
        function transform (command) {
          command.logs = command.logs.trim();

          if (command.cancelled)
            command.state = COMMAND_STATES.CANCELLED;
          else if (command.errored)
            command.state = COMMAND_STATES.FAILED;
          else if (command.complete)
            command.state = COMMAND_STATES.SUCCEEDED;
          else
            command.state = COMMAND_STATES.PENDING;

          command.jobIds = command.jobs.map(function getId (job) {
            return findId.exec(job)[1];
          });

          return command;
        }
      };
    }
  ]);

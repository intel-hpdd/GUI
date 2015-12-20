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


angular.module('command')
  .factory('waitForCommandCompletion', ['λ', 'COMMAND_STATES', 'getCommandStream',
    'openCommandModal', 'throwIfServerErrors',
    function waitForCommandCompletionFactory (λ, COMMAND_STATES, getCommandStream,
                                              openCommandModal, throwIfServerErrors) {
      'use strict';

      /**
       * Makes sure all commands complete
       * @param {Boolean} showModal
       * @param {Object} response
       * @returns {Highland.Stream} A stream that ends when all commands finish.
       */
      return _.curry(function waitForCommandCompletion (showModal, response) {
        return λ([response])
          .map(throwIfServerErrors(_.identity))
          .flatten()
          .pluck('command')
          .compact()
          .collect()
          .filter(_.size)
          .flatMap(wait)
          .map(response)
          .otherwise(λ([response]));

        function wait (commands) {
          var stream = getCommandStream(commands);

          if (showModal) {
            var fork = stream.fork();
            openCommandModal(fork)
              .resultStream
              .each(fork.destroy.bind(fork));
          }

          var isFinished = _.compose(_.inverse, _.fisEqual(COMMAND_STATES.PENDING), _.property('state'));

          return stream
            .fork()
            .filter(_.fevery(isFinished))
            .tap(destroy);

          function destroy () {
            setTimeout(stream.destroy.bind(stream));
          }
        }
      });
    }]);

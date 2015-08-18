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
  .controller('StepModalCtrl', ['$scope', 'stepsStream', 'jobStream', 'COMMAND_STATES',
    function StepModalCtrl ($scope, stepsStream, jobStream, COMMAND_STATES) {
      'use strict';

      _.extend(this, {
        steps: [],
        accordion0: true,
        /**
         * Returns an adjective describing the state of the job.
         * @param {Object} job
         * @returns {String}
         */
        getJobAdjective: function getJobAdjective (job) {
          if (job.state === 'pending')
            return COMMAND_STATES.WAITING;

          if (job.state !== 'complete')
            return COMMAND_STATES.RUNNING;

          if (job.cancelled)
            return COMMAND_STATES.CANCELLED;
          else if (job.errored)
            return COMMAND_STATES.FAILED;
          else
            return COMMAND_STATES.SUCCEEDED;
        },
        getDescription: function getDescription (step) {
          return step.description.indexOf(step.class_name) === 0 ? step.class_name : step.description;
        }
      });

      $scope.$on('$destroy', jobStream.destroy.bind(jobStream));

      var localApply = $scope.localApply.bind(null, $scope);

      jobStream
        .tap(_.set('job', this))
        .stopOnError($scope.handleException)
        .each(localApply);

      stepsStream
        .tap(_.set('steps', this))
        .stopOnError($scope.handleException)
        .each(localApply);
    }])
  .factory('openStepModal', ['$modal', 'socketStream', function openStepModalFactory ($modal, socketStream) {
    'use strict';

    var extractId = /\/api\/step\/(\d+)\/$/;

    /**
     * Opens the step modal to show information about
     * the provided job.
     * @param {Object} job
     * @returns {Object}
     */
    return function openStepModal (job) {
      var jobStream = socketStream('/job/' + job.id);
      jobStream.write(job);

      var s2 = jobStream.fork();
      s2.destroy = jobStream.destroy.bind(jobStream);

      return $modal.open({
        templateUrl: 'iml/command/assets/html/step-modal.html',
        controller: 'StepModalCtrl',
        controllerAs: 'stepModal',
        windowClass: 'step-modal',
        backdrop: 'static',
        resolve: {
          jobStream: _.fidentity(s2),
          stepsStream: _.fidentity(jobStream.fork()
            .pluck('steps')
            .map(_.fmap(function getId (step) {
              return step.replace(extractId, '$1');
            }))
            .flatMap(function getSteps (stepIds) {
              return socketStream('/step', {
                qs: {
                  id__in: stepIds,
                  limit: 0
                }
              }, true);
            })
            .pluck('objects'))
        }
      });
    };
  }]);

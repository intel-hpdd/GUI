//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import socketStream from '../socket/socket-stream.js';
import COMMAND_STATES from './command-states.js';

import {
  map,
  invokeMethod,
  always
} from 'intel-fp';

// $FlowIgnore: HTML templates that flow does not recognize.
import stepModalTemplate from './assets/html/step-modal.html!text';

export function StepModalCtrl ($scope, stepsStream, jobStream) {
  'ngInject';

  angular.extend(this, {
    steps: [],
    accordion0: true,
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
  $scope.$on('$destroy', stepsStream.destroy.bind(stepsStream));

  var p = $scope.propagateChange($scope, this);

  p('job', jobStream);
  p('steps', stepsStream);
}

export function openStepModalFactory ($uibModal) {
  'ngInject';

  var extractApiId = map(invokeMethod('replace', [/\/api\/step\/(\d+)\/$/, '$1']));

  return function openStepModal (job) {
    var jobStream = socketStream('/job/' + job.id);
    jobStream.write(job);

    var s2 = jobStream.fork();
    s2.destroy = jobStream.destroy.bind(jobStream);

    return $uibModal.open({
      template: stepModalTemplate,
      controller: 'StepModalCtrl',
      controllerAs: 'stepModal',
      windowClass: 'step-modal',
      backdrop: 'static',
      resolve: {
        jobStream: always(s2),
        stepsStream: always(jobStream.fork()
          .pluck('steps')
          .map(extractApiId)
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
}

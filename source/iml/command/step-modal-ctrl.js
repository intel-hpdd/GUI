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

import * as fp from '@mfl/fp';
import socketStream from '../socket/socket-stream.js';
import COMMAND_STATES from './command-states.js';

export function StepModalCtrl($scope, stepsStream, jobStream) {
  'ngInject';
  Object.assign(this, {
    steps: [],
    accordion0: true,
    getJobAdjective: function getJobAdjective(job) {
      if (job.state === 'pending') return COMMAND_STATES.WAITING;

      if (job.state !== 'complete') return COMMAND_STATES.RUNNING;

      if (job.cancelled) return COMMAND_STATES.CANCELLED;
      else if (job.errored) return COMMAND_STATES.FAILED;
      else return COMMAND_STATES.SUCCEEDED;
    },
    getDescription: function getDescription(step) {
      return step.description.indexOf(step.class_name) === 0
        ? step.class_name
        : step.description;
    }
  });

  $scope.$on('$destroy', jobStream.destroy.bind(jobStream));
  $scope.$on('$destroy', stepsStream.destroy.bind(stepsStream));

  const p = $scope.propagateChange.bind(null, $scope, this);

  p('job', jobStream);
  p('steps', stepsStream);
}

export function openStepModalFactory($uibModal) {
  'ngInject';
  const extractApiId = fp.map(x => x.replace(/\/api\/step\/(\d+)\/$/, '$1'));

  return job => {
    const jobStream = socketStream('/job/' + job.id);
    jobStream.write(job);

    const s2 = jobStream.fork();
    s2.destroy = jobStream.destroy.bind(jobStream);

    return $uibModal.open({
      template: `<div class="modal-header">
  <h3 class="modal-title">{{ ::stepModal.job.description }}</h3>
</div>
<div class="modal-body">
  <h4>Details:</h4>
  <table class="table">
    <tr>
      <td>Run At</td>
      <td>{{ ::stepModal.job.modified_at | date:'MMM dd yyyy HH:mm:ss' }}</td>
    </tr>
    <tr>
      <td>Status</td>
      <td><job-states job="stepModal.job"></job-states> {{ stepModal.getJobAdjective(stepModal.job) | capitalize }}</td>
    </tr>
  </table>
  <h4>Steps</h4>
  <div class="well" ng-if="stepModal.steps.length === 0">
    Loading Steps... <i class="fa fa-spinner fa-spin"></i>
  </div>
  <uib-accordion close-others="false" ng-if="stepModal.steps.length > 0">
    <uib-accordion-group is-open="stepModal['accordion' + $index]" ng-repeat="step in stepModal.steps track by step.id">
      <uib-accordion-heading>
        <i class="fa" ng-class="{'fa-chevron-down': stepModal['accordion' + $index], 'fa-chevron-right': !stepModal['accordion' + $index]}"></i>
        <i class="fa header-status" ng-class="{'fa-exclamation': step.state === 'failed', 'fa-check': step.state === 'success', 'fa-refresh fa-spin': step.state === 'incomplete'}"></i>
        <span>
          {{ ::step.step_index + 1  }}/{{ ::step.step_count }}  {{ ::stepModal.getDescription(step) }}
        </span>
      </uib-accordion-heading>
      <h4>Arguments</h4>
      <pre class="logs">{{ step.args|json }}</pre>
      <div ng-if="step.console">
        <h4>Logs</h4>
        <pre class="logs">{{ step.console }}</pre>
      </div>
      <div ng-if="step.backtrace">
        <h4>Backtrace</h4>
        <pre class="logs">{{ step.backtrace }}</pre>
      </div>
    </uib-accordion-group>
  </uib-accordion>
</div>
<div class="modal-footer">
  <button class="btn btn-danger" ng-click="$close('close')">Close <i class="fa fa-times-circle-o"></i></button>
</div>`,
      controller: 'StepModalCtrl',
      controllerAs: 'stepModal',
      windowClass: 'step-modal',
      backdrop: 'static',
      resolve: {
        jobStream: fp.always(s2),
        stepsStream: fp.always(
          jobStream
            .fork()
            .pluck('steps')
            .map(extractApiId)
            .flatMap(stepIds =>
              socketStream(
                '/step',
                {
                  qs: {
                    id__in: stepIds,
                    limit: 0
                  }
                },
                true
              )
            )
            .pluck('objects')
        )
      }
    });
  };
}

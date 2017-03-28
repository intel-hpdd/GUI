//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import extractApi from 'intel-extract-api';
import socketStream from '../socket/socket-stream.js';
import * as fp from 'intel-fp';

export function JobTreeCtrl($scope, getJobStream, GROUPS, openStepModal) {
  'ngInject';
  const pendingTransitions = [];

  Object.assign(this, {
    GROUPS,
    jobs: [],
    openStep: openStepModal,
    showTransition: function showTransition(job) {
      return job.available_transitions.length > 0 &&
        pendingTransitions.indexOf(job.id) === -1;
    },
    doTransition: function doTransition(job, newState) {
      job.state = newState;

      pendingTransitions.push(job.id);

      socketStream(
        job.resource_uri,
        {
          method: 'put',
          json: job
        },
        true
      ).each(function putDone() {
        pendingTransitions.splice(pendingTransitions.indexOf(job.id), 1);
      });
    }
  });

  const stream = getJobStream($scope.command.jobs);

  const p = $scope.propagateChange($scope, this, 'jobs');

  stream.through(p);

  $scope.$on('$destroy', stream.destroy.bind(stream));
}

export function getJobStreamFactory(jobTree) {
  'ngInject';
  return function getJobStream(jobs) {
    const stream = socketStream('/job', {
      qs: {
        id__in: fp.map(extractApi, jobs),
        limit: 0
      }
    });

    const s2 = stream.pluck('objects').map(jobTree);

    s2.destroy = stream.destroy.bind(stream);

    return s2;
  };
}

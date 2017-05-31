//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import extractApi from 'intel-extract-api';
import socketStream from '../socket/socket-stream.js';
import {
  map
} from 'intel-fp';

export function JobTreeCtrl ($scope, getJobStream, GROUPS, openStepModal) {
  'ngInject';

  var pendingTransitions = [];

  angular.extend(this, {
    GROUPS: GROUPS,
    jobs: [],
    openStep: openStepModal,
    showTransition: function showTransition (job) {
      return job.available_transitions.length > 0 && pendingTransitions.indexOf(job.id) === -1;
    },
    doTransition: function doTransition (job, newState) {
      job.state = newState;

      pendingTransitions.push(job.id);

      socketStream(job.resource_uri, {
        method: 'put',
        json: job
      }, true)
        .each(function putDone () {
          pendingTransitions.splice(pendingTransitions.indexOf(job.id), 1);
        });
    }
  });

  var stream = getJobStream($scope.command.jobs);

  var p = $scope.propagateChange($scope, this, 'jobs');

  stream
    .through(p);

  $scope.$on('$destroy', stream.destroy.bind(stream));
}


export function getJobStreamFactory (jobTree) {
  'ngInject';

  return function getJobStream (jobs) {
    var stream = socketStream('/job', {
      qs: {
        id__in: map(extractApi, jobs),
        limit: 0
      }
    });

    var s2 = stream
      .pluck('objects')
      .map(jobTree);

    s2.destroy = stream.destroy.bind(stream);

    return s2;
  };
}

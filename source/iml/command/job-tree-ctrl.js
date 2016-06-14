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

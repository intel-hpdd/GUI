//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

export function addServerStepsFactory(
  ADD_SERVER_STEPS,
  addServersStep,
  serverStatusStep,
  selectServerProfileStep
) {
  'ngInject';
  const steps = {};
  steps[ADD_SERVER_STEPS.ADD] = addServersStep;
  steps[ADD_SERVER_STEPS.STATUS] = serverStatusStep;
  steps[ADD_SERVER_STEPS.SELECT_PROFILE] = selectServerProfileStep;

  return steps;
}

export function getAddServerManagerFactory(
  addServerSteps,
  stepsManager,
  waitUntilLoadedStep,
  ADD_SERVER_STEPS
) {
  'ngInject';
  return function getAddServerManager() {
    const manager = stepsManager();

    _.pairs(addServerSteps).forEach(function addStep(pair) {
      manager.addStep(pair[0], pair[1]);
    });

    manager.addWaitingStep(waitUntilLoadedStep);
    manager.SERVER_STEPS = ADD_SERVER_STEPS;

    return manager;
  };
}

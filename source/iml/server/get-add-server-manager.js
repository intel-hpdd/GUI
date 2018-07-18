//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function addServerStepsFactory(ADD_SERVER_STEPS, addServersStep, serverStatusStep, selectServerProfileStep) {
  'ngInject';
  const steps = {};
  steps[ADD_SERVER_STEPS.ADD] = addServersStep;
  steps[ADD_SERVER_STEPS.STATUS] = serverStatusStep;
  steps[ADD_SERVER_STEPS.SELECT_PROFILE] = selectServerProfileStep;

  return steps;
}

export function getAddServerManagerFactory(addServerSteps, stepsManager, waitUntilLoadedStep, ADD_SERVER_STEPS) {
  'ngInject';
  return function getAddServerManager() {
    const manager = stepsManager();
    Object.entries(addServerSteps).forEach(pair => {
      manager.addStep(pair[0], pair[1]);
    });

    manager.addWaitingStep(waitUntilLoadedStep);
    manager.SERVER_STEPS = ADD_SERVER_STEPS;

    return manager;
  };
}

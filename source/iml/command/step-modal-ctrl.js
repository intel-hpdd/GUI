// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import socketStream from "../socket/socket-stream.js";
import COMMAND_STATES from "./command-states.js";
import { Component, linkEvent } from "inferno";
import highland from "highland";
import moment from "moment";
import { JobStateIconComponent } from "./command-module.js";
import { capitalize } from "../filters/capitalize-filter.js";
import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import AccordionComponent, { PanelComponent } from "../accordion.js";

import type { JobT } from "./command-modal-ctrl.js";
import type { HighlandStreamT } from "highland";

const getDescription = step => (step.description.indexOf(step.class_name) === 0 ? step.class_name : step.description);

export function StepModalCtrl($scope, stepsStream, jobStream) {
  "ngInject";
  Object.assign(this, {
    steps: [],
    accordion0: true,
    getJobAdjective: function getJobAdjective(job) {
      if (job.state === "pending") return COMMAND_STATES.WAITING;

      if (job.state !== "complete") return COMMAND_STATES.RUNNING;

      if (job.cancelled) return COMMAND_STATES.CANCELLED;
      else if (job.errored) return COMMAND_STATES.FAILED;
      else return COMMAND_STATES.SUCCEEDED;
    },
    getDescription
  });

  $scope.$on("$destroy", jobStream.destroy.bind(jobStream));
  $scope.$on("$destroy", stepsStream.destroy.bind(stepsStream));

  const p = $scope.propagateChange.bind(null, $scope, this);

  p("job", jobStream);
  p("steps", stepsStream);
}

const extractApiId = fp.map(x => x.replace(/\/api\/step\/(\d+)\/$/, "$1"));
export function openStepModalFactory($uibModal) {
  "ngInject";

  return job => {
    const jobStream = socketStream("/job/" + job.id);
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
      controller: "StepModalCtrl",
      controllerAs: "stepModal",
      windowClass: "step-modal",
      backdrop: "static",
      resolve: {
        jobStream: fp.always(s2),
        stepsStream: fp.always(
          jobStream
            .fork()
            .pluck("steps")
            .map(extractApiId)
            .flatMap(stepIds =>
              socketStream(
                "/step",
                {
                  qs: {
                    id__in: stepIds,
                    limit: 0
                  }
                },
                true
              )
            )
            .pluck("objects")
        )
      }
    });
  };
}

const LoadingStepsComponent = steps => {
  if (steps.length === 0)
    return (
      <div class="well">
        Loading Steps... <i class="fa fa-spinner fa-spin" />
      </div>
    );
};

const Title = ({ collapsed, step, description }) => {
  return (
    <span>
      <i className={`fa ${collapsed ? "fa-chevron-down" : "fa-chevron-right"}`} />
      <i
        className={`fa header-status ${step.state === "cancelled" ? "fa-times" : ""} ${
          step.state === "failed" ? "fa-exclamation" : ""
        } ${step.state === "success" ? "fa-check" : ""} ${step.state === "incomplete" ? "fa-refresh fa-spin" : ""}`}
      />
      <span>
        {step.step_index + 1} / {step.step_count} {description}
      </span>
    </span>
  );
};

const StepConsoleComponent = ({ step }) => {
  if (step.console)
    return (
      <div>
        <h4>Logs</h4>
        <pre class="logs">{step.console}</pre>
      </div>
    );
};

const StepBacktraceComponent = ({ step }) => {
  if (step.backtrace)
    return (
      <div>
        <h4>Backtrace</h4>
        <pre class="logs">{step.backtrace}</pre>
      </div>
    );
};

const StepsComponent = ({ steps, getDescription }) => {
  if (steps.length > 0)
    return (
      <AccordionComponent id="steps-accordion">
        {steps.map((step, idx) => {
          return (
            <PanelComponent>
              <Title collapsed={idx === 0} step={step} description={getDescription(step)} />
              <div>
                <h4>Arguments</h4>
                <pre class="logs">{JSON.stringify(step.args, null, 2)}</pre>
                <StepConsoleComponent step={step} />
                <StepBacktraceComponent step={step} />
              </div>
            </PanelComponent>
          );
        })}
      </AccordionComponent>
    );
};

const getJobAdjective = (job: JobT) => {
  if (job.state === "pending") return COMMAND_STATES.WAITING;

  if (job.state !== "complete") return COMMAND_STATES.RUNNING;

  if (job.cancelled) return COMMAND_STATES.CANCELLED;
  else if (job.errored) return COMMAND_STATES.FAILED;
  else return COMMAND_STATES.SUCCEEDED;
};

const onClose = ({ stream }: { stream: HighlandStreamT<boolean> }) => {
  stream.write(true);
  stream.end();
};

type StepModalPropsT = {
  job: JobT,
  steps: Array<*>,
  stream: HighlandStreamT<boolean>
};

export const StepModalComponent = ({ job, steps, stream }: StepModalPropsT) => {
  return (
    <div class="modal-open">
      <Modal visible={true} moreClasses={["step-modal"]} zIndex={1060}>
        <Header class="modal-header">
          <h3 class="modal-title">{job.description}</h3>
        </Header>
        <Body>
          <>
            <h4>Details:</h4>
            <table class="table">
              <tbody>
                <tr>
                  <td>Run At</td>
                  <td>{moment(job.modified_at).format("MMM DD YYYY HH:mm:ss")}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <JobStateIconComponent job={job} /> {capitalize(getJobAdjective(job))}
                  </td>
                </tr>
              </tbody>
            </table>
            <h4>Steps</h4>
            <LoadingStepsComponent steps={steps} />
            <StepsComponent steps={steps} getDescription={getDescription} />
          </>
        </Body>
        <Footer class="modal-footer">
          <button class="btn btn-danger" onClick={linkEvent({ stream }, onClose)}>
            Close <i class="fa fa-times-circle-o" />
          </button>
        </Footer>
      </Modal>
      <Backdrop visible={true} moreClasses={["step-modal-backdrop"]} zIndex={1059} />
    </div>
  );
};

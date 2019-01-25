// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import COMMAND_STATES from "./command-states.js";
import { linkEvent } from "inferno";
import moment from "moment";
import { JobStateIconComponent } from "./command-module.js";
import { capitalize } from "../filters/capitalize-filter.js";
import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import AccordionComponent, { PanelComponent } from "../accordion.js";

import type { HighlandStreamT } from "highland";

const getDescription = step => (step.description.indexOf(step.class_name) === 0 ? step.class_name : step.description);

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

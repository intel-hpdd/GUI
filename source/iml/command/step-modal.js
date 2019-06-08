// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import COMMAND_STATES from "./command-states.js";
import moment from "moment";
import JobStateIconComponent from "./job-state-icon-component.js";
import { capitalize } from "../filters/capitalize-filter.js";
import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";
import WindowKeyListener from "../window-key-listener.js";
import AccordionComponent, { PanelComponent } from "../accordion.js";
import { Component } from "inferno";
import getStore from "../store/get-store.js";
import { MODAL_STACK_ADD_MODAL, MODAL_STACK_REMOVE_MODAL } from "../modal-stack-reducer.js";

import type { JobT, StepT } from "./command-types.js";
import type { HighlandStreamT } from "highland";

const STEP_MODAL_NAME: "STEP_MODAL_NAME" = "STEP_MODAL_NAME";

const getDescription = step => (step.description.indexOf(step.class_name) === 0 ? step.class_name : step.description);

const LoadingStepsComponent = ({ steps }: { steps: StepT[] }) => {
  if (steps.length === 0)
    return (
      <div class="well">
        Loading Steps... <i class="fa fa-spinner fa-spin" />
      </div>
    );
  else return null;
};

const Title = ({ collapsed, step, description }) => {
  return (
    <span>
      <i className={`fa ${collapsed ? "fa-chevron-right" : "fa-chevron-down"}`} />
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
        <pre class="logs" dangerouslySetInnerHTML={{ __html: step.console }} />
      </div>
    );
  else return null;
};

const StepBacktraceComponent = ({ step }) => {
  if (step.backtrace)
    return (
      <div>
        <h4>Backtrace</h4>
        <pre class="logs">{step.backtrace}</pre>
      </div>
    );
  else return null;
};

const StepsComponent = ({ steps, getDescription }) => {
  if (steps.length > 0) {
    const accordionSteps = steps.map((step, idx) => {
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
    });

    return <AccordionComponent id="steps-accordion">{accordionSteps}</AccordionComponent>;
  } else {
    return null;
  }
};

const getJobAdjective = (job: JobT) => {
  if (job.state === "pending") return COMMAND_STATES.WAITING;

  if (job.state !== "complete") return COMMAND_STATES.RUNNING;

  if (job.cancelled) return COMMAND_STATES.CANCELLED;
  else if (job.errored) return COMMAND_STATES.FAILED;
  else return COMMAND_STATES.SUCCEEDED;
};

type StepModalPropsT = {
  job: JobT,
  steps: StepT[],
  closeCb: () => void
};

type StepModalStateT = {|
  topModalName: string
|};

export class StepModalComponent extends Component {
  props: StepModalPropsT;
  state: StepModalStateT;

  modalStack$: HighlandStreamT<string[]>;

  componentDidMount() {
    this.modalStack$ = getStore.select("modalStack");
    this.modalStack$.each((xs: string[]) => {
      const [top] = [...xs];

      if (top)
        this.setState({
          topModalName: top
        });
    });

    getStore.dispatch({
      type: MODAL_STACK_ADD_MODAL,
      payload: STEP_MODAL_NAME
    });
  }

  componentWillUnmount() {
    getStore.dispatch({
      type: MODAL_STACK_REMOVE_MODAL,
      payload: STEP_MODAL_NAME
    });
    this.modalStack$.end();
  }

  onEscape = (e: SyntheticKeyboardEvent<HTMLBodyElement>) => {
    if (e.key === "Escape" && this.state.topModalName === STEP_MODAL_NAME) this.props.closeCb();
  };

  render() {
    return (
      <div class="modal-open">
        <WindowKeyListener onKeyDownHandler={this.onEscape} />
        <Modal visible={true} moreClasses={["step-modal"]} zIndex={1060}>
          <Header class="modal-header">
            <h3 class="modal-title">{this.props.job.description}</h3>
          </Header>
          <Body>
            <>
              <h4>Details:</h4>
              <table class="table">
                <tbody>
                  <tr>
                    <td>Run At</td>
                    <td>{moment(this.props.job.modified_at).format("MMM DD YYYY HH:mm:ss")}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      <JobStateIconComponent job={this.props.job} /> {capitalize(getJobAdjective(this.props.job))}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h4>Steps</h4>
              <LoadingStepsComponent steps={this.props.steps} />
              <StepsComponent steps={this.props.steps} getDescription={getDescription} />
            </>
          </Body>
          <Footer class="modal-footer">
            <button class="btn btn-danger" onClick={this.props.closeCb}>
              Close <i class="fa fa-times-circle-o" />
            </button>
          </Footer>
        </Modal>
        <Backdrop visible={true} moreClasses={["step-modal-backdrop"]} zIndex={1059} />
      </div>
    );
  }
}

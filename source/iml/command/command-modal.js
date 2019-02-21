// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from "@iml/fp";
import { Component, linkEvent } from "inferno";
import { GROUPS, RestrictToComponent } from "../auth/authorization.js";

import { Modal, Header, Body, Footer, Backdrop } from "../modal.js";

import AccordionComponent, { PanelComponent } from "../accordion.js";

import moment from "moment";

import { capitalize } from "../filters/capitalize-filter.js";

import extractApi from "@iml/extract-api";

import { jobTree } from "./job-tree-factory.js";

import { JobStateIconComponent } from "./command-module.js";
import DropdownContainer from "../dropdown-component.js";
import WindowClickListener from "../window-click-listener.js";

import socketStream from "../socket/socket-stream.js";
import getStore from "../store/get-store.js";
import { SHOW_STEP_MODAL_ACTION } from "../command/step-modal-reducer.js";

import type { Command, JobT } from "./command-types.js";
import type { HighlandStreamT } from "highland";

const Title = ({ collapsed, command }) => {
  return (
    <span>
      <i className={`fa ${collapsed ? "fa-chevron-right" : "fa-chevron-down"}`} />
      <i
        className={`fa header-status${command.state === "cancelled" ? " fa-times" : ""}${
          command.state === "failed" ? " fa-exclamation" : ""
        }${command.state === "succeeded" ? " fa-check" : ""}${
          command.state === "pending" ? " fa-refresh fa-spin" : ""
        }`}
      />
      <span>
        {command.message} - {moment(command.created_at).format("MMM DD YYYY HH:mm:ss")}
      </span>
    </span>
  );
};

type JobStatesPropsT = {
  job: JobT
};

type JobStatesStateT = {
  stepModalVisible: boolean
};

export class JobStatesComponent extends Component {
  props: JobStatesPropsT;
  state: JobStatesStateT;

  constructor(props: JobStatesPropsT) {
    super(props);

    this.state = {
      stepModalVisible: false
    };
  }

  openStep({ job }: JobStatesPropsT) {
    getStore.dispatch({
      type: SHOW_STEP_MODAL_ACTION,
      payload: job
    });
  }

  render() {
    if (this.props.job.steps.length > 0)
      return (
        <a onClick={linkEvent({ job: this.props.job }, this.openStep)}>
          <JobStateIconComponent job={this.props.job} />
          <span>{this.props.job.description}</span>
        </a>
      );
    else
      return (
        <span>
          <JobStateIconComponent job={this.props.job} />
          <span>{this.props.job.description}</span>
        </span>
      );
  }
}

const JobActionComponent = ({ showTransition, doTransition, job }) => {
  if (showTransition(job)) {
    const actionItems = job.available_transitions.map(transition => {
      return (
        <li>
          <a onClick={() => doTransition(job, transition.state)}>{transition.label}</a>
        </li>
      );
    });

    return (
      <WindowClickListener>
        <DropdownContainer extraCss={["job-actions"]}>
          <button
            type="button"
            class="btn btn-xs btn-primary dropdown-toggle"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Actions <i class="fa fa-caret-down" />
          </button>
          <ul role="menu" class="dropdown-menu">
            {actionItems}
          </ul>
        </DropdownContainer>
      </WindowClickListener>
    );
  }
};

const JobComponent = ({
  showTransition,
  doTransition,
  job
}: {
  showTransition: Function,
  doTransition: Function,
  job: JobT
}) => {
  return (
    <div class="child-job">
      <JobStatesComponent job={job} />
      <RestrictToComponent group={GROUPS.FS_ADMINS}>
        <JobActionComponent showTransition={showTransition} doTransition={doTransition} job={job} />
        {job.children.map(childJob => {
          return <JobComponent showTransition={showTransition} doTransition={doTransition} job={childJob} />;
        })}
      </RestrictToComponent>
    </div>
  );
};

type JobTreeComponentPropsT = {
  jobResourceUrls: string[]
};

type JobTreeComponentStatesT = {
  pendingTransitions: number[],
  jobs: JobT[]
};

class JobTreeComponent extends Component {
  props: JobTreeComponentPropsT;
  state: JobTreeComponentStatesT;

  constructor(props) {
    super(props);

    this.state = {
      pendingTransitions: [],
      jobs: []
    };

    this.getJobStream(props.jobResourceUrls).each(jobs => {
      this.setState({
        jobs
      });
    });
  }

  openStep() {}

  showTransition(job) {
    return job.available_transitions.length > 0 && this.state.pendingTransitions.indexOf(job.id) === -1;
  }

  getJobStream(jobs) {
    const stream = socketStream("/job", {
      qs: {
        id__in: fp.map(extractApi)(jobs),
        limit: 0
      }
    });

    const s2 = stream.pluck("objects").map(jobTree);

    s2.destroy = stream.destroy.bind(stream);

    return s2;
  }

  doTransition(job, newState) {
    job.state = newState;

    this.setState({
      pendingTransitions: [...this.state.pendingTransitions, job.id]
    });

    socketStream(
      job.resource_uri,
      {
        method: "put",
        json: job
      },
      true
    ).each(() => {
      this.setState({
        pendingTransitions: this.state.pendingTransitions.filter(x => x !== job.id)
      });
    });
  }

  render() {
    if (this.state.jobs.length === 0)
      return (
        <div>
          <h4>Jobs</h4>
          <div class="well jobs">
            <div>
              Loading Jobs... <i class="fa fa-spinner fa-spin" />
            </div>
          </div>
        </div>
      );
    else
      return (
        <div>
          <h4>Jobs</h4>
          <div class="well jobs">
            <div>
              {this.state.jobs.map(job => {
                return (
                  <JobComponent
                    job={job}
                    showTransition={this.showTransition.bind(this)}
                    doTransition={this.doTransition.bind(this)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
  }
}

const CommandLogsComponent = ({ logs }) => {
  if (logs)
    return (
      <div>
        <h4>Logs</h4>
        <pre class="logs">{logs}</pre>
      </div>
    );
};

const onClose = (stream: HighlandStreamT<boolean>) => {
  stream.write(true);
  stream.end();
};

type CommandModalComponentT = {
  commands: Command[],
  stream: HighlandStreamT<*>
};

export const CommandModalComponent = ({ commands, stream }: CommandModalComponentT) => {
  return (
    <div class="modal-open">
      <Modal visible={true} moreClasses={["command-modal"]} zIndex={1050}>
        <Header class="modal-header">
          <h3 class="modal-title">Commands</h3>
        </Header>
        <Body moreClasses={["command-modal-body"]}>
          <>
            <AccordionComponent id="command-accordion">
              {commands.map((command, idx) => {
                return (
                  <PanelComponent
                    collapsed={idx > 0}
                    panelId={`collapse${idx}`}
                    headingId={`heading${idx}`}
                    accordionId={"command-accordion"}
                  >
                    <Title command={command} collapsed={idx === 0} />
                    <>
                      <h4>Details:</h4>
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Created At</td>
                            <td>{moment(command.created_at).format("MMM DD YYYY HH:mm:ss")}</td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>{capitalize(command.state)}</td>
                          </tr>
                        </tbody>
                      </table>

                      <JobTreeComponent jobResourceUrls={command.jobs} />
                      <CommandLogsComponent logs={command.logs} />
                    </>
                  </PanelComponent>
                );
              })}
            </AccordionComponent>
          </>
        </Body>
        <Footer class="modal-footer">
          <button class="btn btn-danger" onClick={linkEvent(stream, onClose)}>
            Close <i class="fa fa-times-circle-o" />
          </button>
        </Footer>
      </Modal>
      <Backdrop visible={true} moreClasses={["command-modal-backdrop"]} zIndex={1049} />
    </div>
  );
};

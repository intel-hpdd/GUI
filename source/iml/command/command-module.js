//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import * as fp from "@iml/fp";
import { render } from "inferno";
import extendScopeModule from "../extend-scope-module";
import commandMonitorDirective from "./command-monitor-directive.js";
import DeferredCommandModalBtnCtrl from "./deferred-cmd-modal-btn-controller";
import jobStatesDirective from "./job-states-directive";
import jobTreeFactory from "./job-tree-factory";
import getStore from "../store/get-store.js";
import getCommandStream from "./get-command-stream.js";
import highland from "highland";
import global from "../global.js";
import socketStream from "../socket/socket-stream.js";
import multiStream from "../multi-stream.js";
import { setState, trimLogs } from "./command-transforms.js";

import { deferredCmdModalBtnDirective } from "./deferred-cmd-modal-btn-directive";
import { JobTreeCtrl, getJobStreamFactory } from "./job-tree-ctrl";
import { StepModalComponent } from "./step-modal-ctrl";
import { CommandModalComponent } from "./command-modal.js";
import { querySelector } from "../dom-utils";
import { SET_ACTION_DROPDOWN_INACTIVE_ACTION } from "../action-dropdown/action-dropdown-reducer.js";

export default angular
  .module("command", [extendScopeModule])
  .controller("DeferredCommandModalBtnCtrl", DeferredCommandModalBtnCtrl)
  .directive("commandMonitor", commandMonitorDirective)
  .directive("deferredCmdModalBtn", deferredCmdModalBtnDirective)
  .controller("JobTreeCtrl", JobTreeCtrl)
  .factory("getJobStream", getJobStreamFactory)
  .directive("jobStates", jobStatesDirective)
  .factory("jobTree", jobTreeFactory).name;

export const JobStateIconComponent = ({ job }) => {
  let icon;
  switch (job.state) {
    case "pending":
      icon = <i class="fa fa-ellipsis-h" />;
      break;
    case "complete":
      icon = (
        <i
          className={`fa ${job.cancelled ? "fa-times" : ""} ${job.errored ? "fa-exclamation" : ""} ${
            !job.errored && !job.cancelled ? "fa-check" : ""
          }`}
        />
      );
      break;
    default:
      icon = <i class="fa fa-refresh fa-spin" />;
  }

  return <span class="job-state">{icon}</span>;
};

const commandModalContainer = document.createElement("div");
const body = querySelector(global.document, "body");
getStore.select("commandModal").each((commands: Command[]) => {
  const containerOnBody = body.contains(commandModalContainer);
  if (commands.length === 0 || containerOnBody === true) return;

  body.appendChild(commandModalContainer);

  const stream = highland();
  render(<CommandModalComponent commands={[]} stream={stream} />, commandModalContainer);
  getCommandStream(commands)
    .map(
      fp.map(
        fp.flow(
          trimLogs,
          setState
        )
      )
    )
    .each(([...commands]) => {
      render(<CommandModalComponent commands={commands} stream={stream} />, commandModalContainer);
    });

  stream.pull(() => {
    render(null, commandModalContainer);
    body.removeChild(commandModalContainer);

    getStore.dispatch({
      type: SET_ACTION_DROPDOWN_INACTIVE_ACTION,
      payload: {}
    });
  });
});

const stepsModalContainer = document.createElement("div");
const extractApiId = fp.map(x => x.replace(/\/api\/step\/(\d+)\/$/, "$1"));
getStore.select("stepModal").each(({ ...job }: { job: JobT }) => {
  const containerOnBody = body.contains(stepsModalContainer);
  if (!job.id || containerOnBody === true) return;

  body.appendChild(stepsModalContainer);

  const stream = socketStream("/job/" + job.id);
  stream.write(job);

  const jobStream = stream.fork();
  jobStream.destroy = stream.destroy.bind(stream);

  const stepsStream1 = stream.fork();
  stepsStream1.destroy = stream.destroy.bind(stream);
  const stepsStream2 = stepsStream1
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
    .pluck("objects");
  stepsStream2.destroy = stepsStream1.destroy.bind(stream);

  const modalStream = highland();

  render(<StepModalComponent job={job} steps={[]} stream={modalStream} />, stepsModalContainer);
  multiStream([jobStream, stepsStream2]).each(([job, steps]) => {
    render(<StepModalComponent job={job} steps={steps} stream={modalStream} />, stepsModalContainer);
  });

  modalStream.pull(() => {
    render(null, stepsModalContainer);
    body.removeChild(stepsModalContainer);
  });
});

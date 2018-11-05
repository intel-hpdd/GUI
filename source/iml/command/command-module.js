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
import { StepModalCtrl, openStepModalFactory, StepModalComponent } from "./step-modal-ctrl";
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
  .controller("StepModalCtrl", StepModalCtrl)
  .factory("openStepModal", openStepModalFactory)
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

getStore.select("commandModal").each((commands: Command[]) => {
  if (commands.length === 0) return;

  const body = querySelector(global.document, "body");
  const container = document.createElement("div");
  body.appendChild(container);

  const stream = highland();
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
      render(<CommandModalComponent commands={commands} stream={stream} />, container);
    });

  stream.pull(() => {
    render(null, container);
    body.removeChild(container);

    getStore.dispatch({
      type: SET_ACTION_DROPDOWN_INACTIVE_ACTION,
      payload: {}
    });
  });
});

const extractApiId = fp.map(x => x.replace(/\/api\/step\/(\d+)\/$/, "$1"));
getStore.select("stepModal").each(({ ...job }: { job: JobT }) => {
  if (!job.id) return;
  const body = querySelector(global.document, "body");
  const container = document.createElement("div");
  body.appendChild(container);

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

  multiStream([jobStream, stepsStream2]).each(([job, steps]) => {
    render(<StepModalComponent job={job} steps={steps} stream={modalStream} />, container);
  });

  modalStream.pull(() => {
    render(null, container);
    body.removeChild(container);
  });
});

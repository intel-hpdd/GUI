import * as fp from "@iml/fp";
import { render } from "inferno";
import getStore from "../store/get-store.js";
import getCommandStream from "./get-command-stream.js";
import global from "../global.js";
import socketStream from "../socket/socket-stream.js";
import multiStream from "../multi-stream.js";
import { setState, trimLogs } from "./command-transforms.js";

import { StepModalComponent } from "./step-modal.js";
import { CommandModalComponent } from "./command-modal.js";
import { querySelector } from "../dom-utils";
import { CLEAR_CONFIRM_ACTION } from "../action-dropdown/confirm-action-reducer.js";

const commandModalContainer = document.createElement("div");
const body = querySelector(global.document, "body");
getStore.select("commandModal").each(([...commands]: Command[]) => {
  const containerOnBody = body.contains(commandModalContainer);
  if (commands.length === 0 || containerOnBody === true) return;

  body.appendChild(commandModalContainer);

  const command$ = getCommandStream(commands);
  const onClose = () => {
    command$.end();
    render(null, commandModalContainer);
    body.removeChild(commandModalContainer);

    getStore.dispatch({
      type: CLEAR_CONFIRM_ACTION,
      payload: false
    });
  };

  render(<CommandModalComponent commands={[]} closeCb={onClose} />, commandModalContainer);
  command$
    .map(
      fp.map(
        fp.flow(
          trimLogs,
          setState
        )
      )
    )
    .each(([...xs]) => {
      render(<CommandModalComponent commands={xs} closeCb={onClose} />, commandModalContainer);
    });
});

const stepsModalContainer = document.createElement("div");
const extractApiId = fp.map(x => x.replace(/\/api\/step\/(\d+)\/$/, "$1"));
getStore.select("stepModal").each(({ ...job }: { job: JobT }) => {
  const containerOnBody = body.contains(stepsModalContainer);
  if (!job.id || containerOnBody === true) return;

  body.appendChild(stepsModalContainer);

  const stream = socketStream(`/job/${job.id}`);
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

  const m$ = multiStream([jobStream, stepsStream2]);
  const onClose = () => {
    m$.end();
    render(null, stepsModalContainer);
    body.removeChild(stepsModalContainer);
  };

  render(<StepModalComponent job={job} steps={[]} closeCb={onClose} />, stepsModalContainer);
  m$.each(([job, steps]) => {
    render(<StepModalComponent job={job} steps={steps} closeCb={onClose} />, stepsModalContainer);
  });
});

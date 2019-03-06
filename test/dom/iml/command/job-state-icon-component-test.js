// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import JobStateIconComponent from "../../../../source/iml/command/job-state-icon-component.js";
import { type JobT } from "../../../../source/iml/command/command-types.js";
import { render } from "inferno";

describe("job state icon component", () => {
  let job: JobT, div, body;
  beforeEach(() => {
    job = {
      children: [],
      available_transitions: [
        {
          label: "Cancel",
          state: "cancelled"
        }
      ],
      cancelled: false,
      class_name: "StartTargetJob",
      commands: ["/api/command/230/"],
      created_at: "2019-03-05T17:23:14.773266",
      description: "Start target MGS",
      errored: false,
      id: 523,
      modified_at: "2019-03-05T17:23:14.773240",
      read_locks: [],
      resource_uri: "/api/job/523/",
      state: "tasked",
      step_results: {
        "/api/step/951/": null
      },
      steps: ["/api/step/951/", "/api/step/952/"],
      wait_for: [],
      write_locks: []
    };

    body = document.querySelector("body");
    div = document.createElement("div");

    if (body != null) body.appendChild(div);
  });

  afterEach(() => {
    render(null, div);
    if (body) body.removeChild(div);
  });

  it("should render pending state", () => {
    job.state = "pending";
    render(<JobStateIconComponent job={job} />, div);
    expect(div).toMatchSnapshot();
  });

  it("should render complete state", () => {
    job.state = "complete";
    render(<JobStateIconComponent job={job} />, div);
    expect(div).toMatchSnapshot();
  });

  it("should render pending state", () => {
    job.state = "other";
    render(<JobStateIconComponent job={job} />, div);
    expect(div).toMatchSnapshot();
  });
});

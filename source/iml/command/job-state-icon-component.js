// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { type JobT } from "./command-types.js";

export default ({ job }: { job: JobT }) => {
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

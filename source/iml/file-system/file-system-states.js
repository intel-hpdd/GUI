// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { GROUPS } from "../auth/authorization.js";
import {
  getData,
  fileSystem$,
  target$,
  server$,
  locks$,
  alertIndicator$,
  stratagemConfiguration$
} from "./file-system-detail-resolves.js";
import {
  fileSystem$ as fsFileSystem$,
  target$ as fsTarget$,
  locks$ as fsLocks$,
  alertIndicator$ as fsAlertIndicator$
} from "./file-system-resolves.js";
import { metricPoll } from "../metrics/metric-polling.js";

export const fileSystemListState = {
  url: "/configure/filesystem",
  name: "app.fileSystem",
  component: "fileSystemPage",
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: "Graphical_User_Interface_9_0.html#9.3.3",
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    kind: "File Systems",
    icon: "fa-copy"
  },
  resolve: {
    fileSystem$: fsFileSystem$,
    target$: fsTarget$,
    locks$: fsLocks$,
    alertIndicator$: fsAlertIndicator$,
    metricPoll$: metricPoll
  }
};

export const fileSystemDetailState = {
  name: "app.fileSystemDetail",
  url: "/configure/filesystem/:id",
  component: "filesystemDetailPage",
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: "Graphical_User_Interface_9_0.html#9.1.1",
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    kind: "File System Detail",
    icon: "fa-copy"
  },
  resolve: {
    getData,
    fileSystem$,
    target$,
    server$,
    locks$,
    alertIndicator$,
    stratagemConfiguration$,
    metricPoll$: metricPoll
  }
};

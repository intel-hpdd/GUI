// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
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
import { metricPoll } from "../metrics/metric-polling.js";

export const fileSystemListState = {
  url: "/configure/filesystem",
  name: "app.fileSystem",
  controller: function controller() {
    "ngInject";

    this.fileSystem$ = store.select("fileSystems");

    this.target$ = store.select("targets");

    this.locks$ = store.select("locks");

    this.alertIndicator$ = store.select("alertIndicators").map(Object.values);

    this.metricPoll$ = metricPoll();
  },
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
  controllerAs: "$ctrl",
  template: `<div class="container container-full">
<file-system file-system-$="$ctrl.fileSystem$" alert-indicator-$="$ctrl.alertIndicator$"
   locks-$="$ctrl.locks$" target-$="$ctrl.target$"></file-system>
</div>
`
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

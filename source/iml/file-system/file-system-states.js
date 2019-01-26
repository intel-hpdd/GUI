// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";
import broadcaster from "../broadcaster.js";

import { GROUPS } from "../auth/authorization.js";

import { type $scopeT } from "angular";

export const fileSystemListState = {
  url: "/configure/filesystem",
  name: "app.fileSystem",
  controller: function controller() {
    "ngInject";

    this.fileSystem$ = store.select("fileSystems");

    this.locks$ = store
      .select("locks")
      .map((xs: LockT) => ({ ...xs }))
      .each(locks => (this.locks = locks));

    this.alertIndicator$ = broadcaster(store.select("alertIndicators"));
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
    icon: "fa-files-o"
  },
  controllerAs: "$ctrl",
  template: `<div class="container container-full">
<file-system file-system-$="$ctrl.fileSystem$" alert-indicator-$="$ctrl.alertIndicator$"
   locks="$ctrl.locks"></file-system>
</div>
`
};

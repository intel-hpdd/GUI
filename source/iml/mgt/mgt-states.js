// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { mgt$, locks$, mgtAlertIndicatorB } from "./mgt-resolves.js";

import { GROUPS } from "../auth/authorization.js";

export const mgtState = {
  name: "app.mgt",
  url: "/configure/mgt",
  component: "mgtPage",
  params: {
    resetState: {
      dynamic: true
    }
  },
  data: {
    helpPage: "Graphical_User_Interface_9_0.html#9.3.8",
    access: GROUPS.FS_ADMINS,
    anonymousReadProtected: true,
    kind: "MGTs",
    icon: "fa-bullseye"
  },
  resolve: {
    mgt$,
    mgtAlertIndicatorB,
    locks$
  }
};

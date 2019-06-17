// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import commandModule from "../command/command-module";
import { actionDropdown } from "./action-dropdown";
import { hsmActionDropdown } from "./hsm-action-dropdown";
import uiBootstrapModule from "angular-ui-bootstrap";

export default angular
  .module("action-dropdown-module", [commandModule, uiBootstrapModule])
  .component("actionDropdown", actionDropdown)
  .component("hsmActionDropdown", hsmActionDropdown).name;

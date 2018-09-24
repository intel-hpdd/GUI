// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

import asValueModule from "../as-value/as-value-module.js";
import authModule from "../auth/auth-module.js";
import messageSubstitutionModule from "../message-substitution/message-substitution-module.js";
import logQueryComponent from "./log-query-component.js";
import logTableComponent from "./log-table-component.js";

export default angular
  .module("logModule", [authModule, asValueModule, messageSubstitutionModule])
  .component("logQuery", logQueryComponent)
  .component("logTable", logTableComponent).name;

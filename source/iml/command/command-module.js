//
// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import extendScopeModule from "../extend-scope-module";
import commandMonitorDirective from "./command-monitor-directive.js";
import deferredCmdModalBtnDirective from "./deferred-cmd-modal-btn-directive";

export default angular
  .module("command", [extendScopeModule])
  .component("deferredCmdModalBtn", deferredCmdModalBtnDirective)
  .directive("commandMonitor", commandMonitorDirective).name;

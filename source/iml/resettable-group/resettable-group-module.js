// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import extendScopeModule from "../extend-scope-module.js";
import resettableGroupComponent from "./resettable-group.js";
import resetter from "./resetter.js";

export default angular
  .module("resettableGroup", [extendScopeModule])
  .component("resettableGroup", resettableGroupComponent)
  .directive("resetter", resetter).name;

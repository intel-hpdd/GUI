// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

import extendScopeModule from "../extend-scope-module.js";
import helpMapperComponent from "./help-mapper-directive.js";

export default angular.module("helpMapper", [extendScopeModule]).directive("helpMapper", helpMapperComponent).name;

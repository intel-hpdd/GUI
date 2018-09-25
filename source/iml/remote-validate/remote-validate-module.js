// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";

import { remoteValidateForm, remoteValidateComponent } from "./remote-validate.js";

export default angular
  .module("remote-validate", [])
  .directive("remoteValidateForm", () => remoteValidateForm)
  .directive("remoteValidateComponent", () => remoteValidateComponent).name;

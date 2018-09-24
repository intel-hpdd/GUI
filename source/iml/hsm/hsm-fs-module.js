// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import commandModule from "../command/command-module";
import highlandModule from "../highland/highland-module";
import HsmFsCtrl from "./hsm-fs-controller";

export default angular.module("hsmFs", [commandModule, highlandModule]).controller("HsmFsCtrl", HsmFsCtrl).name;

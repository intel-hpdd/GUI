// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from "angular";
import fileSystemComponent from "./file-system-component.js";
import fileSystemDetailPage from "./file-system-detail-component.js";

export default angular
  .module("fileSystem", [])
  .component("filesystemDetailPage", fileSystemDetailPage)
  .component("fileSystem", fileSystemComponent).name;

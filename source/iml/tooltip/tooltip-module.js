//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import uiBootstrapModule from 'angular-ui-bootstrap';

import { helpTooltip } from './tooltip';

export default angular.module('iml-tooltip', [uiBootstrapModule]).directive('helpTooltip', helpTooltip).name;

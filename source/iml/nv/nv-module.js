// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import d3Module from '../d3/d3-module';
import nv from 'nvd3';

export default angular.module('nv', [d3Module]).value('nv', nv).name;

// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  bindings: {
    record: "<"
  },
  template: `
    <i class="fa fa-fw fa-hdd-o"></i> {{$ctrl.record.label}} ({{$ctrl.record.size | fmtBytes}})
  `
};

// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type commandT = {
  cancelled:boolean,
  complete:boolean,
  created_at:string,
  errored:boolean,
  id:number,
  jobs:mixed[],
  logs:string,
  message:string,
  resource_uri:string
};

export type commandResponseT = {
  meta:{
    limit:number,
    next:string,
    offset:number,
    previous:?number,
    total_count:number
  },
  objects:commandT[]
};

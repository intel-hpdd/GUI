// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


import {
  SET_DURATION,
  SET_SORT
} from './job-stats-reducer.js';

export const setDuration = (duration:number) => ({
  type: SET_DURATION,
  payload: {
    duration
  }
});

export const setSort = (orderBy:string, desc:boolean) => ({
  type: SET_SORT,
  payload: {
    orderBy,
    desc
  }
});

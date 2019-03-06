// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export type Command = {
  cancelled: boolean,
  complete: boolean,
  created_at: string,
  errored: boolean,
  id: number,
  jobs: mixed[],
  logs: string,
  message: string,
  state: string,
  resource_uri: string
};

export type CommandResponse = {
  meta: {
    limit: number,
    next: string,
    offset: number,
    previous: ?number,
    total_count: number
  },
  objects: Command[]
};

export type JobT = {
  id: number,
  state: string,
  resource_uri: string,
  available_transitions: Array<*>,
  description: string,
  steps: Array<*>,
  children: JobT[],
  cancelled: boolean,
  created_at: string,
  errored: boolean,
  modified_at: string
};

export type StepT = {
  state: "success" | "incomplete",
  args: string[],
  step_index: number,
  step_count: number,
  class_name: string,
  description: string,
  console: string,
  backtrace: string
};

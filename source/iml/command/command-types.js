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

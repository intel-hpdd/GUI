// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { HighlandStreamT } from 'highland';

export type ActionT = {
  type: string,
  payload: any
};

export type StoreT = {
  dispatch: (x: any) => boolean,
  select: (key: string) => HighlandStreamT<any>
};

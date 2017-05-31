// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.


import type {
  HighlandStreamT
} from 'highland';

export type SocketStreamT<T> = (path:string, options:Object, isAck?:boolean) => HighlandStreamT<T>;

// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import produce from "immer";

type TToT = <T>(T: T) => T | void;
const draftToOriginal: TToT = () => undefined;

export const immutableOriginal = produce((draftToOriginal: TToT));
export const smartSpread = ((produce((Object.assign: any)): any): (...args: Object[]) => Object);

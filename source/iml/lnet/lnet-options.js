// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default (Array.from(Array(50), (x: void, idx: number) => idx - 1).map(
  value => (value === -1 ? { name: "Not Lustre Network", value } : { name: `Lustre Network ${value}`, value })
): { name: string, value: number }[]);

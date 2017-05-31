// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export function noSpace (parts:string[], ...args:any[]):string {
  const built = parts.reduce(
    (acc, p, i) => acc + args[i - 1] + p
  );

  return built.replace(/\s/g, '');
}

export function cleanTemplate (parts:string[], ...args:any[]):string {
  const built = parts.reduce(
    (acc, p, i) => acc + args[i - 1] + p
  );

  return built
    .replace(/^\s+/gm, '')
    .replace(/\n/g, '');
}

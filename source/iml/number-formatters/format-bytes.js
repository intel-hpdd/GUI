// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default function formatBytes (bytes:number, precision:number) {
  if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
  precision = precision || 4;

  bytes = Math.max(bytes, 0);
  let pwr = Math.floor(Math.log(bytes) / Math.log(1024));
  pwr = Math.min(pwr, units.length - 1);
  pwr = Math.max(pwr, 0);
  bytes /= Math.pow(1024, pwr);
  return `${bytes.toPrecision(precision)} ${units[pwr]}`;
}

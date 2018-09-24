// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import global from "./global.js";

export const crypto = global.crypto;
export default () => {
  const array = new Uint32Array(1);
  return crypto.getRandomValues(array)[0];
};

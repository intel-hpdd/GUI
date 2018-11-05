// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { CACHE_INITIAL_DATA } from "./environment.js";

export default (profileName: string): ?ServerProfileT =>
  CACHE_INITIAL_DATA.server_profile.find(x => x.name === profileName);

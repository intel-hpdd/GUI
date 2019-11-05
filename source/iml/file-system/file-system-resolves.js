// Copyright (c) 2019 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import store from "../store/get-store.js";

export const fileSystem$ = () => store.select("fileSystems");

export const target$ = () => store.select("targets");

export const locks$ = () => store.select("locks");

export const alertIndicator$ = () => store.select("alertIndicators").map(Object.values);

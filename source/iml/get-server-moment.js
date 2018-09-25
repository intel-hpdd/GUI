// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import moment from "moment";
import { SERVER_TIME_DIFF } from "./environment.js";

export default (...args: any[]) => moment(...args).add(SERVER_TIME_DIFF);

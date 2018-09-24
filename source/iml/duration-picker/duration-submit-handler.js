// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import getStore from "../store/get-store.js";

import type { rangeFormT, durationFormT } from "./duration-picker-module.js";

export default (chartType: string, key: Object) => {
  return (overrides: Object, { rangeForm, durationForm }: { rangeForm: rangeFormT, durationForm: durationFormT }) => {
    if (rangeForm)
      getStore.dispatch({
        type: chartType,
        payload: Object.assign(
          {
            configType: "range",
            startDate: rangeForm.start.$modelValue,
            endDate: rangeForm.end.$modelValue
          },
          key,
          overrides
        )
      });
    else if (durationForm)
      getStore.dispatch({
        type: chartType,
        payload: Object.assign(
          {
            configType: "duration",
            size: durationForm.size.$modelValue,
            unit: durationForm.unit.$modelValue
          },
          key,
          overrides
        )
      });
  };
};

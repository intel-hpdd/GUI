// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from "inferno";
import getStore from "../store/get-store.js";
import { setTimeZoneToUtc, setTimeZoneToLocal } from "./tz-picker-actions.js";
import { asViewer } from "../as-viewer/as-viewer.js";

import type { TzPickerProps } from "./tz-picker-reducer.js";

const handleChange = evt => {
  if (evt.target.id === "utc") getStore.dispatch(setTimeZoneToUtc());
  else getStore.dispatch(setTimeZoneToLocal());
};

const TzLabel = ({ id }) => {
  if (id === "utc") return <span>UTC</span>;
  else return <span>Local</span>;
};

const TzPickerElement = ({ isChecked, id }) => {
  if (isChecked)
    return (
      <div class="radio">
        <label class="radio">
          <input type="radio" name="tzPicker" id={id} onChange={handleChange} checked="checked" />
          <TzLabel id={id} />
        </label>
      </div>
    );
  else
    return (
      <div class="radio">
        <label class="radio">
          <input type="radio" name="tzPicker" id={id} onChange={handleChange} />
          <TzLabel id={id} />
        </label>
      </div>
    );
};

export const TzPicker = asViewer("tzPicker", ({ tzPicker: { isUtc } }: { tzPicker: TzPickerProps }) => {
  return (
    <div class="detail-panel">
      <h5 class="section-header">Select Timezone</h5>
      <TzPickerElement isChecked={isUtc === true} id="utc" />
      <TzPickerElement isChecked={isUtc === false} id="local" />
    </div>
  );
});

export const tzPickerComponent = {
  bindings: {
    stream: "<"
  },
  controller: function($element: HTMLElement[]) {
    "ngInject";

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(<TzPicker viewer={this.stream} />, el);
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
    };
  }
};

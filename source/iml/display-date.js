// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import { asViewer } from './as-viewer/as-viewer.js';
import moment from 'moment';

import type { TzPickerProps } from './tz-picker/tz-picker-reducer.js';

const formatString = 'YYYY-MM-DD HH:mm:ss';

const displayDate = (date: string, isUtc: boolean) => {
  if (isUtc === true) return moment.utc(date).format(formatString);
  else return moment(date).format(formatString);
};

export const DisplayDate = asViewer(
  'tzPicker',
  ({ tzPicker: { isUtc }, datetime }: { tzPicker: TzPickerProps, datetime: string }) => {
    return (
      <span class="date">
        <span>{displayDate(datetime, isUtc)}</span>
      </span>
    );
  }
);

export const displayDateComponent = {
  bindings: {
    tzPickerB: '<',
    datetime: '<'
  },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(<DisplayDate viewer={this.tzPickerB} datetime={this.datetime} />, el);
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
    };
  }
};

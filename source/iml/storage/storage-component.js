// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import connectToStore from '../connect-to-store';

export const NoDataComponent = ({ xs }) => {
  if (xs.length === 0)
    return (
      <div class="well text-center no-plugins">
        <h1>No storage plugins are currently installed.</h1>
        <p>
          When storage plugins are installed,
          use this tab to configure and view storage resources such as
          controllers.
        </p>
      </div>
    );
};

export const DataComponent = ({ xs }) => {
  if (xs.length > 0)
    return (
      <div class="well text-center no-plugins">
        <h1>Storage plugins are currently installed.</h1>
        <p>
          When storage plugins are installed,
          use this tab to configure and view storage resources such as
          controllers.
        </p>
      </div>
    );
};

export const StorageComponent = connectToStore('storage', ({ storage }) =>
  <div class="container container-full storage container">
    <NoDataComponent xs={storage} />
    <DataComponent xs={storage} />
  </div>
);

export default {
  // bindings: { storage$: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';
    Inferno.render(<StorageComponent />, $element[0]);
  }
};

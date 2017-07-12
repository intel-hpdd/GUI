// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';

export function StorageComponentDetail() {
  // if no-plugins found
  return (
    <div class="container container-full storage container">
      <div class="well text-center no-plugins">
        <h1>Storage Detail.</h1>
        <p>
          When storage plugins are installed, use this tab to configure and view
          storage resources such as controllers.
        </p>
      </div>
    </div>
    // else plugins found
    // return the plugin detail
  );
}

export default {
  bindings: {},
  controller: function($element: HTMLElement[]) {
    'ngInject';
    Inferno.render(<StorageComponentDetail />, $element[0]);
  }
};

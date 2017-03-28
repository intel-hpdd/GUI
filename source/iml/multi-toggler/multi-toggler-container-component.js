// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default {
  controller: function() {
    const toggles = [];

    this.register = toggle => {
      toggles.push(toggle);
    };

    this.deregister = toggle => {
      const idx = toggles.indexOf(toggle);

      if (idx === -1) return;

      toggles.splice(idx, 1);
    };

    this.toggleChange = state => {
      switch (state) {
        case 'all':
          toggles.map(x => x.$setViewValue(true));
          break;
        case 'none':
          toggles.map(x => x.$setViewValue(false));
          break;
        case 'invert':
          toggles.map(x => x.$setViewValue(!x.$viewValue));
          break;
      }

      toggles.forEach(x => x.$render());
    };
  }
};

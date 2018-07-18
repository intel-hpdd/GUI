// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export default () => {
  return {
    restrict: 'A',
    bindToController: 'true',
    require: {
      togglerContainer: '^multiTogglerContainer',
      ngModel: 'ngModel'
    },
    controller: function() {
      'ngInject';
      this.$onInit = () => {
        this.togglerContainer.register(this.ngModel);

        this.$onDestroy = () => {
          this.togglerContainer.deregister(this.ngModel);
        };
      };
    }
  };
};

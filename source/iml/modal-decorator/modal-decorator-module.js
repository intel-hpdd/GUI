//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import angular from 'angular';
import highlandModule from '../highland/highland-module';

export default angular.module('modal-decorator', [highlandModule]).config($provide => {
  'ngInject';
  $provide.decorator('$uibModal', (highland, $delegate) => {
    /* jshint -W034 */
    'ngInject';
    return {
      open(modalOptions) {
        const modalInstance = $delegate.open(modalOptions);

        modalInstance.resultStream = highland(modalInstance.result).errors((err, push) => {
          if (err === 'backdrop click' || err === 'escape key press') push(null, 'closed');
          else push(err);
        });

        return modalInstance;
      }
    };
  });
}).name;

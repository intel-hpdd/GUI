//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from '@iml/lodash-mixins';

const template =
  '<div class="modal-header"> \
      <h3>An Error Has Occurred!</h3> \
  </div> \
  <div class="modal-body"> \
    <ul> \
      <li ng-repeat="item in exceptionModal.messages"> \
        <h5>{{ item.name | capitalize:true }}:</h5> \
        <pre ng-if="exceptionModal.loadingStack && item.name === \'Client Stack Trace\'" \
        class="loading">Processing... <i class="fa fa-spinner fa-spin fa-2x"></i></pre> \
        <pre ng-if="!exceptionModal.loadingStack || item.name !== \'Client Stack Trace\'">{{item.value}}</pre> \
      </li> \
    </ul> \
  </div> \
  <div class="modal-footer"> \
    <button ng-click="exceptionModal.reload()" class="btn btn-large btn-block" type="button"> \
      <i class="icon-rotate-right"></i> Reload\
    </button> \
  </div>';

export default $uibModal => {
  'ngInject';
  const defaultOptions = {
    backdrop: 'static',
    controller: 'ExceptionModalCtrl',
    keyboard: false,
    template,
    windowClass: 'exception-modal'
  };

  return function open(opts) {
    const options = _.merge(defaultOptions, opts);

    return $uibModal.open(options);
  };
};

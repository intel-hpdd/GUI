//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

const template =
  '<div class="modal-header"> \
      <h3> \
        <i class="fa fa-exclamation-triangle"></i> \
        Encountered An Error \
      </h3> \
  </div> \
  <div class="modal-body text-center"> \
    <p>An unexpected error has occurred. <br />Please collect iml-diagnostics and send to support.</p> \
  </div> \
  <div class="modal-footer"> \
    <button ng-click="exceptionModal.reload()" class="btn btn-large btn-block" type="button"> \
      <i class="fa fa-refresh"></i> Reload\
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
    const options = Object.assign(defaultOptions, opts);

    return $uibModal.open(options);
  };
};

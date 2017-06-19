import exceptionModal from '../../../../source/iml/exception/exception-modal.js';

describe('exception modal', () => {
  let $uibModal, modal;

  beforeEach(() => {
    $uibModal = {
      open: jest.fn()
    };

    modal = exceptionModal($uibModal);
  });

  it('should call the modal with the expected params', () => {
    modal();
    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'exception-modal',
      keyboard: false,
      controller: 'ExceptionModalCtrl',
      template:
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
  </div>'
    });
  });
});

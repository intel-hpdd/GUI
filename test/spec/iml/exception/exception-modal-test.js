import angular from 'angular';
const {module, inject} = angular.mock;

describe('exception modal', () => {
  var $uibModal;

  beforeEach(module('exception', ($provide) => {
    $uibModal = {
      open: jasmine.createSpy('open')
    };

    $provide.value('$uibModal', $uibModal);
  }));

  it('should call the modal with the expected params', inject((exceptionModal) => {
    exceptionModal();

    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'exception-modal',
      keyboard: false,
      controller: 'ExceptionModalCtrl',
      template: jasmine.any(String)
    });
  }));
});

import angular from '../../../angular-mock-setup.js';

import disconnectModalModule
  from '../../../../source/iml/disconnect-modal/disconnect-modal-module.js';

describe('disconnect modal', () => {
  let $uibModal, $timeout, modal;

  beforeEach(
    angular.mock.module(
      disconnectModalModule,
      {
        windowUnload: { unloading: false }
      },
      $provide => {
        modal = {};
        $uibModal = {
          open: jasmine.createSpy('open').and.returnValue(modal)
        };
        $provide.value('$uibModal', $uibModal);
      }
    )
  );

  let disconnectModal, windowUnload;

  beforeEach(
    inject((_disconnectModal_, _windowUnload_, _$timeout_) => {
      disconnectModal = _disconnectModal_;
      windowUnload = _windowUnload_;
      $timeout = _$timeout_;
    })
  );

  afterEach(() => {
    windowUnload.unloading = false;
  });

  it('should call the modal with the expected params', () => {
    disconnectModal.open();
    $timeout.flush();

    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'disconnect-modal',
      keyboard: false,
      template: jasmine.any(String)
    });
  });

  it('should not open the modal if window has unloaded', () => {
    windowUnload.unloading = true;
    disconnectModal.open();
    $timeout.flush();

    expect($uibModal.open).not.toHaveBeenCalled();
  });

  it('should not open the modal if the modal already exists', () => {
    disconnectModal.open();
    $timeout.flush();
    disconnectModal.open();
    $timeout.flush();

    expect($uibModal.open).toHaveBeenCalledTimes(1);
  });
});

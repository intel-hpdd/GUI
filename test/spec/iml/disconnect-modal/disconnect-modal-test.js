import disconnectModalModule from '../../../../source/iml/disconnect-modal/disconnect-modal-module';

describe('disconnect modal', () => {
  var $uibModal;

  beforeEach(module(disconnectModalModule, {
    windowUnload: { unloading: false }
  }, ($provide) => {
    $uibModal = {
      open: jasmine.createSpy('open')
    };
    $provide.value('$uibModal', $uibModal);
  }));

  var disconnectModal, windowUnload;

  beforeEach(inject((_disconnectModal_, _windowUnload_) => {
    disconnectModal = _disconnectModal_;
    windowUnload = _windowUnload_;
  }));

  afterEach(() => {
    windowUnload.unloading = false;
  });

  it('should call the modal with the expected params', () => {
    disconnectModal();

    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'disconnect-modal',
      keyboard: false,
      template: jasmine.any(String)
    });
  });

  it('should not open the modal if window has unloaded', () => {
    windowUnload.unloading = true;
    disconnectModal();

    expect($uibModal.open).not.toHaveBeenCalledOnce();
  });
});

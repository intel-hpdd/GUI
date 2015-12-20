import angular from 'angular';
const {module, inject} = angular.mock;

describe('disconnect modal', () => {
  var $modal;

  beforeEach(module('exception', {
    windowUnload: { unloading: false }
  }, ($provide) => {
    $modal = {
      open: jasmine.createSpy('open')
    };
    $provide.value('$modal', $modal);
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

    expect($modal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'disconnect-modal',
      keyboard: false,
      template: jasmine.any(String)
    });
  });

  it('should not open the modal if window has unloaded', () => {
    windowUnload.unloading = true;
    disconnectModal();

    expect($modal.open).not.toHaveBeenCalledOnce();
  });
});

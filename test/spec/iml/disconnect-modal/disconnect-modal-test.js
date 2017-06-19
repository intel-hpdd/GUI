import angular from '../../../angular-mock-setup.js';
import windowUnloadFactory from '../../../../source/iml/disconnect-modal/disconnect-modal.js';

describe('disconnect modal', () => {
  let $uibModal,
    $timeout,
    modal,
    $window,
    disconnectModalFactory,
    disconnectModal,
    mockWindowUnload;

  beforeEach(() => {});

  beforeEach(
    angular.mock.inject((_$timeout_, _$window_) => {
      $timeout = _$timeout_;
      $window = _$window_;
    })
  );

  beforeEach(() => {
    modal = {};
    $uibModal = {
      open: jest.fn(() => modal)
    };

    jest.mock(
      '../../../../source/iml/window-unload.js',
      () => mockWindowUnload
    );

    mockWindowUnload = windowUnloadFactory($window);
    disconnectModalFactory = require('../../../../source/iml/disconnect-modal/disconnect-modal.js')
      .default;

    disconnectModal = disconnectModalFactory($uibModal, $timeout);
  });

  afterEach(() => {
    mockWindowUnload.unloading = false;
  });

  it('should call the modal with the expected params', () => {
    disconnectModal.open();
    $timeout.flush();

    expect($uibModal.open).toHaveBeenCalledWith({
      backdrop: 'static',
      windowClass: 'disconnect-modal',
      keyboard: false,
      template: expect.any(String)
    });
  });

  it('should not open the modal if window has unloaded', () => {
    mockWindowUnload.unloading = true;
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

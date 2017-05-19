import windowUnloadModule
  from '../../../../source/iml/window-unload/window-unload-module';
import angular from '../../../angular-mock-setup.js';

describe('window unload', () => {
  let $window;

  beforeEach(
    angular.mock.module(windowUnloadModule, $provide => {
      $window = {
        addEventListener: jest.fn()
      };
      $provide.value('$window', $window);
    })
  );

  let windowUnload;

  beforeEach(
    inject(_windowUnload_ => {
      windowUnload = _windowUnload_;
    })
  );

  it('should register a beforeunload listener to $window', () => {
    expect($window.addEventListener).toHaveBeenCalledOnceWith(
      'beforeunload',
      expect.any(Function)
    );
  });

  it('should return an object representing unload state', () => {
    expect(windowUnload).toEqual({ unloading: false });
  });

  it('should change the unloading state once beforeunload has fired', () => {
    const beforeUnload = $window.addEventListener.mock.calls[0][1];

    beforeUnload();

    expect(windowUnload).toEqual({ unloading: true });
  });
});

describe('window unload', () => {
  let $window, windowUnload;

  beforeEach(() => {
    $window = {
      addEventListener: jest.fn()
    };

    windowUnload = require('../../../../source/iml/window-unload.js').default($window);
  });

  it('should register a beforeunload listener to $window', () => {
    expect($window.addEventListener).toHaveBeenCalledOnceWith('beforeunload', expect.any(Function));
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

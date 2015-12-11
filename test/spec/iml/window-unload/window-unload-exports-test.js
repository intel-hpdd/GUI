describe('window unload', () => {
  var $window;

  beforeEach(module('windowUnload', ($provide) => {
    $window = {
      addEventListener: jasmine.createSpy('addEventListener')
    };
    $provide.value('$window', $window);
  }));

  var windowUnload;

  beforeEach(inject((_windowUnload_) => {
    windowUnload = _windowUnload_;
  }));

  it('should register a beforeunload listener to $window', () => {
    expect($window.addEventListener).toHaveBeenCalledOnceWith('beforeunload', jasmine.any(Function));
  });

  it('should return an object representing unload state', () => {
    expect(windowUnload).toEqual({unloading: false});
  });

  it('should change the unloading state once beforeunload has fired', () => {
    var beforeUnload = $window.addEventListener.mostRecentCall.args[1];

    beforeUnload();

    expect(windowUnload).toEqual({unloading: true});
  });
});

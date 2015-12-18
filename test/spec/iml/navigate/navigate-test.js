describe('navigate', () => {
  var $window;

  beforeEach(window.module('navigate', {UI_ROOT: '/root/of/app/'}, ($provide) => {
    $window = {
      location: {
        href: ''
      }
    };

    $provide.value('$window', $window);
  }));

  var navigate, UI_ROOT;

  beforeEach(inject((_navigate_, _UI_ROOT_) => {
    navigate = _navigate_;
    UI_ROOT = _UI_ROOT_;
  }));

  it('should accept no arguments', () => {
    navigate();

    expect($window.location.href).toBe(UI_ROOT);
  });

  it('should concatenate the part with the ui root', () => {
    var part = 'foo';

    navigate(part);

    expect($window.location.href).toBe(UI_ROOT + part);
  });
});

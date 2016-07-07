import {
  mock,
  resetAll
} from '../../../system-mock.js';


describe('iframe shim component', () => {
  let context, el, $scope, $location, global;

  beforeEachAsync(async function () {
    global = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    const mod = await mock('source/iml/old-gui-shim/iframe-shim-component.js', {
      'source/iml/environment.js': {
        UI_ROOT: '/foo/'
      },
      'source/iml/global.js': {
        default: global
      }
    });

    el = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    $scope = {
      $apply: jasmine.createSpy('$apply')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    context = {
      path: 'bar',
      params: {
        id: 3
      }
    };

    mod.default.controller.call(context, [el], $scope, $location);
  });

  afterEach(resetAll);

  it('should set loading to true', () => {
    expect(context.loading)
      .toBe(true);
  });

  it('should set the src', () => {
    expect(context.src)
      .toBe('/foo/bar/3');
  });

  describe('on load', () => {
    beforeEach(() => {
      el
        .addEventListener
        .calls
        .mostRecent()
        .args[1]();
    });

    it('should set loading to false', () => {
      expect(context.loading)
        .toBe(false);
    });

    it('should apply the scope', () => {
      expect($scope.$apply)
        .toHaveBeenCalledOnce();
    });
  });

  describe('on message', () => {
    beforeEach(() => {
      global
        .addEventListener
        .calls
        .mostRecent()
        .args[1]({
          data: '/bar/baz/4'
        });
    });

    it('should set the path', () => {
      expect($location.path)
        .toHaveBeenCalledOnceWith('/bar/baz/4');
    });

    it('should apply the scope', () => {
      expect($scope.$apply)
        .toHaveBeenCalledOnce();
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      context.$onDestroy();
    });

    it('should remove the load event listener', () => {
      expect(el.removeEventListener)
        .toHaveBeenCalledOnceWith('load', jasmine.any(Function), true);
    });

    it('should remove the message event listener', () => {
      expect(global.removeEventListener)
        .toHaveBeenCalledOnceWith('message', jasmine.any(Function), false);
    });
  });
});

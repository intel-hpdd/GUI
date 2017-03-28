import { mock, resetAll } from '../../../system-mock.js';

describe('iframe shim component', () => {
  let context, el, $scope, $location, global, frame;

  beforeEachAsync(async function() {
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

    frame = {
      style: {},
      contentDocument: {
        body: {
          scrollHeight: 0
        }
      }
    };

    el = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      classList: {
        add: jasmine.createSpy('add'),
        remove: jasmine.createSpy('remove')
      },
      querySelector: jasmine.createSpy('querySelector').and.returnValue(frame)
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

    jasmine.clock().install();

    mod.default.controller.call(context, [el], $scope, $location);
  });

  afterEach(resetAll);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should set loading to true', () => {
    expect(el.classList.add).toHaveBeenCalledOnceWith('loading');
  });

  it('should set the src', () => {
    expect(context.src).toBe('/foo/bar/3');
  });

  describe('on load', () => {
    beforeEach(() => {
      el.addEventListener.calls.mostRecent().args[1]();
    });

    it('should set loading to false', () => {
      expect(el.classList.remove).toHaveBeenCalledOnceWith('loading');
    });

    it('should apply the scope', () => {
      expect($scope.$apply).toHaveBeenCalledOnce();
    });

    it('should set the frame height', () => {
      frame.contentDocument.body.scrollHeight = 1000;

      jasmine.clock().tick(500);

      expect(frame.style.height).toBe('1000px');
    });
  });

  describe('on message', () => {
    beforeEach(() => {
      global.addEventListener.calls.mostRecent().args[1]({
        data: '/bar/baz/4'
      });
    });

    it('should set the path', () => {
      expect($location.path).toHaveBeenCalledOnceWith('/bar/baz/4');
    });

    it('should apply the scope', () => {
      expect($scope.$apply).toHaveBeenCalledOnce();
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      context.$onDestroy();
    });

    it('should remove the load event listener', () => {
      expect(el.removeEventListener).toHaveBeenCalledOnceWith(
        'load',
        jasmine.any(Function),
        true
      );
    });

    it('should remove the message event listener', () => {
      expect(global.removeEventListener).toHaveBeenCalledOnceWith(
        'message',
        jasmine.any(Function),
        false
      );
    });
  });
});

describe('iframe shim component', () => {
  let context, el, $scope, $location, mockGlobal, frame;

  beforeEach(() => {

    mockGlobal = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    jest.mock('../../../../source/iml/environment.js', () => ({
      UI_ROOT: '/foo/'
    }));
    jest.mock('../../../../source/iml/global.js', () => mockGlobal);

    const mod = require('../../../../source/iml/old-gui-shim/iframe-shim-component.js');

    frame = {
      style: {},
      contentDocument: {
        body: {
          scrollHeight: 0
        }
      }
    };

    el = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      classList: {
        add: jest.fn(),
        remove: jest.fn()
      },
      querySelector: jest.fn(() => frame)
    };

    $scope = {
      $apply: jest.fn()
    };

    $location = {
      path: jest.fn()
    };

    context = {
      path: 'bar',
      params: {
        id: 3
      }
    };

    jest.useFakeTimers();

    mod.default.controller.call(context, [el], $scope, $location);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should set loading to true', () => {
    expect(el.classList.add).toHaveBeenCalledOnceWith('loading');
  });

  it('should set the src', () => {
    expect(context.src).toBe('/foo/bar/3');
  });

  describe('on load', () => {
    beforeEach(() => {
      el.addEventListener.mock.calls[0][1]();
    });

    it('should set loading to false', () => {
      expect(el.classList.remove).toHaveBeenCalledOnceWith('loading');
    });

    it('should apply the scope', () => {
      expect($scope.$apply).toHaveBeenCalledTimes(1);
    });

    it('should set the frame height', () => {
      frame.contentDocument.body.scrollHeight = 1000;

      jest.runTimersToTime(500);

      expect(frame.style.height).toBe('1000px');
    });
  });

  describe('on message', () => {
    beforeEach(() => {
      mockGlobal.addEventListener.mock.calls[0][1]({
        data: '/bar/baz/4'
      });
    });

    it('should set the path', () => {
      expect($location.path).toHaveBeenCalledOnceWith('/bar/baz/4');
    });

    it('should apply the scope', () => {
      expect($scope.$apply).toHaveBeenCalledTimes(1);
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      context.$onDestroy();
    });

    it('should remove the load event listener', () => {
      expect(el.removeEventListener).toHaveBeenCalledOnceWith(
        'load',
        expect.any(Function),
        true
      );
    });

    it('should remove the message event listener', () => {
      expect(mockGlobal.removeEventListener).toHaveBeenCalledOnceWith(
        'message',
        expect.any(Function),
        false
      );
    });
  });
});

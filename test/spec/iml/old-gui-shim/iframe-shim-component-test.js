import highland from "highland";

describe("iframe shim component", () => {
  let context, el, $scope, $location, locks$, frame;
  let mockGlobal, mockGetStore, mockListeners;

  beforeEach(() => {
    mockGlobal = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    jest.mock("../../../../source/iml/environment.js", () => ({
      UI_ROOT: "/foo/"
    }));
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    locks$ = highland([{ key: "val" }]);
    mockGetStore = {
      select: jest.fn(() => locks$)
    };
    jest.mock("../../../../source/iml/store/get-store.js", () => mockGetStore);

    mockListeners = {
      handleSelectedAction: jest.fn()
    };
    jest.mock("../../../../source/iml/listeners.js", () => mockListeners);

    const mod = require("../../../../source/iml/old-gui-shim/iframe-shim-component.js");

    frame = {
      style: {},
      contentDocument: {
        body: {
          scrollHeight: 0
        }
      },
      contentWindow: {
        postMessage: jest.fn()
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
      path: "bar",
      params: {
        id: 3
      },
      src: ""
    };

    jest.useFakeTimers();

    mod.default.controller.call(context, [el], $scope, $location);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should set loading to true", () => {
    expect(el.classList.add).toHaveBeenCalledOnceWith("loading");
  });

  it("should set the src", () => {
    expect(context.src).toBe("/foo/bar/3");
  });

  describe("on load", () => {
    beforeEach(() => {
      el.addEventListener.mock.calls[0][1]();
    });

    it("should set loading to false", () => {
      expect(el.classList.remove).toHaveBeenCalledOnceWith("loading");
    });

    it("should apply the scope", () => {
      expect($scope.$apply).toHaveBeenCalledTimes(1);
    });

    it("should set the frame height", () => {
      frame.contentDocument.body.scrollHeight = 1000;

      jest.runTimersToTime(500);

      expect(frame.style.height).toBe("1000px");
    });

    it("should call postMessage on the contentWindow", () => {
      expect(frame.contentWindow.postMessage).toHaveBeenCalledTimes(1);
      expect(frame.contentWindow.postMessage).toHaveBeenCalledWith(JSON.stringify({ key: "val" }), "*");
    });
  });

  describe("on message", () => {
    describe("navigation", () => {
      beforeEach(() => {
        mockGlobal.addEventListener.mock.calls[0][1]({
          data: JSON.stringify({
            type: "navigation",
            url: "/bar/baz/4"
          })
        });
      });

      it("should set the path", () => {
        expect($location.path).toHaveBeenCalledOnceWith("/bar/baz/4");
      });

      it("should apply the scope", () => {
        expect($scope.$apply).toHaveBeenCalledTimes(1);
      });

      it("should not call handleSelectedAction", () => {
        expect(mockListeners.handleSelectedAction).not.toHaveBeenCalled();
      });
    });

    describe("action selected", () => {
      beforeEach(() => {
        mockGlobal.addEventListener.mock.calls[0][1]({
          data: JSON.stringify({
            type: "action_selected",
            detail: "detail"
          })
        });
      });

      it("should call handleSelectedAction", () => {
        expect(mockListeners.handleSelectedAction).toHaveBeenCalledTimes(1);
        expect(mockListeners.handleSelectedAction).toHaveBeenCalledWith("detail");
      });

      it("should not call $location.path", () => {
        expect($location.path).not.toHaveBeenCalled();
      });

      it("should not apply the scope", () => {
        expect($scope.$apply).not.toHaveBeenCalled();
      });
    });
  });

  describe("on destroy", () => {
    beforeEach(() => {
      context.$onDestroy();
    });

    it("should remove the load event listener", () => {
      expect(el.removeEventListener).toHaveBeenCalledOnceWith("load", expect.any(Function), true);
    });

    it("should remove the message event listener", () => {
      expect(mockGlobal.removeEventListener).toHaveBeenCalledOnceWith("message", expect.any(Function), false);
    });
  });
});

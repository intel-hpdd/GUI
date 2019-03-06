import exceptionHandlerConfig from "../../../../source/iml/exception/exception-handler.js";
import windowUnloadFactory from "../../../../source/iml/window-unload.js";
import angular from "../../../angular-mock-setup.js";
import { render } from "inferno";

describe("exception handler", () => {
  let oldExceptionHandler;

  beforeEach(
    angular.mock.module(($provide, $exceptionHandlerProvider) => {
      $exceptionHandlerProvider.mode("log");
      oldExceptionHandler = $exceptionHandlerProvider.$get();

      $provide.factory("windowUnload", windowUnloadFactory);
      $provide.value("exceptionModal", jest.fn());
      exceptionHandlerConfig($provide);
    })
  );

  let $exceptionHandler, exceptionModal, windowUnload, error, cause;

  beforeEach(
    angular.mock.inject((_$exceptionHandler_, _exceptionModal_, _windowUnload_) => {
      error = new Error("uh oh!");
      cause = "Something Happened!";

      $exceptionHandler = _$exceptionHandler_;
      exceptionModal = _exceptionModal_;
      windowUnload = _windowUnload_;
    })
  );

  afterEach(() => {
    windowUnload.unloading = false;
  });

  it("should not open the modal if the window is unloading", () => {
    windowUnload.unloading = true;
    $exceptionHandler(new Error("foo"), "bar");

    expect(exceptionModal).not.toHaveBeenCalled();
  });

  describe("handling an exception", () => {
    let oldFetch;

    beforeEach(() => {
      oldFetch = window.fetch;
      window.fetch = jest.fn(() => "fetch");
      $exceptionHandler(error, cause);
    });

    afterEach(() => {
      window.fetch = oldFetch;
    });

    it("should send the request", () => {
      expect(window.fetch).toHaveBeenCalledOnceWith("/iml-srcmap-reverse", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
          trace: error.stack
        })
      });
    });

    it("should open the modal when there is an error", () => {
      expect(exceptionModal).toHaveBeenCalled();
    });

    it("should only open the modal once", () => {
      $exceptionHandler(error, cause);

      expect(exceptionModal).toHaveBeenCalledTimes(1);
    });

    it("should delegate to the older $exceptionHandler", () => {
      expect(oldExceptionHandler.errors[0]).toEqual([error, cause]);
    });
  });
});

describe("exception modal component", () => {
  let body, err, div, mockGlobal, ExceptionModalComponent;
  beforeEach(() => {
    mockGlobal = {
      fetch: jest.fn()
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    body = document.querySelector("body");
    div = document.createElement("div");
    body.appendChild(div);

    err = new Error("oh no!");
    err.stack = "at bla.bla.js:98:11\\nat foo.bar.js:100:12";

    ExceptionModalComponent = require("../../../../source/iml/exception/exception-handler.js").ExceptionModalComponent;
    render(<ExceptionModalComponent exception={err} />, div);
  });

  afterEach(() => {
    render(null, div);
  });

  it("should generate the modal", () => {
    expect(div).toMatchSnapshot();
  });

  it("should send the stack trace to the source map reverse service", () => {
    expect(mockGlobal.fetch).toHaveBeenCalledTimes(1);
    expect(mockGlobal.fetch).toHaveBeenCalledWith("/iml-srcmap-reverse", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        trace: "at bla.bla.js:98:11\\nat foo.bar.js:100:12"
      })
    });
  });
});

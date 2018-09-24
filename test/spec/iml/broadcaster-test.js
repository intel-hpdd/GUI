import highland from "highland";
import broadcaster from "../../../source/iml/broadcaster.js";

describe("broadcaster", () => {
  let source$, broadcast, viewer1$, viewer2$, viewer3$, mock;
  beforeEach(() => {
    mock = jest.fn();
    source$ = highland();
    source$.write(1);
    source$.write(2);
    source$.write(3);

    jest.spyOn(source$, "destroy");

    broadcast = broadcaster(source$);
  });

  describe("with one viewer", () => {
    beforeEach(() => {
      viewer1$ = broadcast();
    });

    it("should pass the latest value to the new viewer", () => {
      viewer1$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });
  });

  describe("with two viewers", () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
    });

    it("should pass the latest value to the first viewer", () => {
      viewer1$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should pass the latest value to the second viewer", () => {
      viewer2$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });
  });

  describe("with three viewers", () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();
    });

    it("should pass the latest value to the first viewer", () => {
      viewer1$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should pass the latest value to the second viewer", () => {
      viewer2$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should pass the latest value to the third viewer", () => {
      viewer3$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });
  });

  describe("on error", () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();

      source$.write({
        __HighlandStreamError__: true,
        error: new Error("boom!")
      });
    });

    it("should receive the error on viewer 1", () => {
      viewer1$.pull(() => {});
      viewer1$.pull(mock);

      expect(mock).toHaveBeenCalledOnceWith(new Error("boom!"), undefined);
    });

    it("should receive the error on viewer 2", () => {
      viewer2$.pull(() => {});
      viewer2$.pull(mock);

      expect(mock).toHaveBeenCalledOnceWith(new Error("boom!"), undefined);
    });

    it("should receive the error on viewer 3", () => {
      viewer3$.pull(() => {});
      viewer3$.pull(mock);

      expect(mock).toHaveBeenCalledOnceWith(new Error("boom!"), undefined);
    });
  });

  describe("destroying", () => {
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();
    });

    describe("one of the viewers", () => {
      beforeEach(() => {
        viewer1$.destroy();
        source$.write(4);
      });

      it("should no longer receive data on the viewer", () => {
        viewer1$.each(mock);
        expect(mock).not.toHaveBeenCalledWith(4);
      });

      it("should receive data on the second stream", () => {
        viewer2$.each(mock);
        expect(mock).toHaveBeenCalledOnceWith(4);
      });

      it("should receive data on the third stream", () => {
        viewer3$.each(mock);
        expect(mock).toHaveBeenCalledOnceWith(4);
      });
    });
  });

  describe("ending the broadcast", () => {
    let viewer4$;
    beforeEach(() => {
      viewer1$ = broadcast();
      viewer2$ = broadcast();
      viewer3$ = broadcast();

      broadcast.endBroadcast();

      viewer4$ = broadcast();

      source$.write(4);
    });

    it("should call destroy on the source$ once", () => {
      expect(source$.destroy).toHaveBeenCalledTimes(1);
    });

    it("should write 3 to the first viewer", () => {
      viewer1$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should not write the latest value to the first viewer", () => {
      viewer1$.each(mock);
      expect(mock).not.toHaveBeenCalledOnceWith(4);
    });

    it("should write 3 to the second viewer", () => {
      viewer2$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should not write the latest value to the second viewer", () => {
      viewer2$.each(mock);
      expect(mock).not.toHaveBeenCalledOnceWith(4);
    });

    it("should write 3 to the third viewer", () => {
      viewer3$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should not write the latest value to the third viewer", () => {
      viewer3$.each(mock);
      expect(mock).not.toHaveBeenCalledOnceWith(4);
    });

    it("should write 3 to the fourth viewer", () => {
      viewer4$.each(mock);
      expect(mock).toHaveBeenCalledOnceWith(3);
    });

    it("should not write the latest value to the fourth viewer", () => {
      viewer4$.each(mock);
      expect(mock).not.toHaveBeenCalledOnceWith(4);
    });
  });
});

import highland from "highland";
import multiStream from "../../../source/iml/multi-stream.js";

describe("multi stream", () => {
  let spy, errSpy, s1, s2, ms;

  beforeEach(() => {
    spy = jest.fn();
    errSpy = jest.fn();

    s1 = highland();
    jest.spyOn(s1, "destroy");
    s2 = highland();
    jest.spyOn(s2, "destroy");
    ms = multiStream([s1, s2]);
    ms.stopOnError(x => errSpy(x)).each(spy);
  });

  it("should be a function", function() {
    expect(multiStream).toEqual(expect.any(Function));
  });

  it("should not emit if all streams not written", function() {
    expect(spy).not.toHaveBeenCalled();
  });

  it("should not emit if all streams not written", function() {
    s1.write("foo");

    expect(spy).not.toHaveBeenCalled();
  });

  it("should emit if all streams written", () => {
    s1.write("foo");
    s2.write("bar");

    expect(spy).toHaveBeenCalledOnceWith(["foo", "bar"]);
  });

  it("should emit errors", () => {
    s1.write({
      __HighlandStreamError__: true,
      error: new Error("boom!")
    });

    expect(errSpy).toHaveBeenCalledOnceWith(new Error("boom!"));
  });

  it("should update if stream 1 writes", () => {
    s1.write("foo");
    s2.write("bar");
    s1.write("baz");

    expect(spy).toHaveBeenCalledOnceWith(["baz", "bar"]);
  });

  it("should update if stream 2 writes", () => {
    s2.write("bar");
    s1.write("foo");
    s2.write("bap");

    expect(spy).toHaveBeenCalledOnceWith(["foo", "bap"]);
  });

  describe("on Destroy", () => {
    beforeEach(() => {
      ms.destroy();
    });

    it("should destroy stream 1", () => {
      expect(s1.destroy).toHaveBeenCalledTimes(1);
    });

    it("should destroy stream 2", () => {
      expect(s2.destroy).toHaveBeenCalledTimes(1);
    });
  });
});

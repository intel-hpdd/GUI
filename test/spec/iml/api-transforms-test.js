import highland from "highland";
import { of } from "@iml/maybe";

import { addCurrentPage, rememberValue, matchById, filterSame } from "../../../source/iml/api-transforms.js";

describe("api transforms", () => {
  describe("add current page", () => {
    it("should return 1 if limit is 0", () => {
      const result = addCurrentPage({
        meta: {
          limit: 0,
          offset: 10
        }
      });

      expect(result).toEqual({
        meta: {
          limit: 0,
          offset: 10,
          current_page: 1
        }
      });
    });

    it("should calculate offset over limit plus 1", () => {
      const result = addCurrentPage({
        meta: {
          limit: 20,
          offset: 20
        }
      });

      expect(result).toEqual({
        meta: {
          limit: 20,
          offset: 20,
          current_page: 2
        }
      });
    });
  });

  describe("remember value", () => {
    let spy, in$, transformFn;

    beforeEach(() => {
      transformFn = jest.fn();

      spy = jest.fn();
      in$ = highland();

      rememberValue(transformFn)(in$).each(spy);

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should remember on a value", () => {
      transformFn.mockImplementation(s => highland([s]));

      in$.write("foo");

      jest.runOnlyPendingTimers();

      expect(spy).toHaveBeenCalledOnceWith("foo");
    });

    it("should remember when no value", () => {
      transformFn.mockImplementation(() => highland([]));

      in$.write("foo");

      in$.end();

      jest.runOnlyPendingTimers();

      expect(spy).toHaveBeenCalledOnceWith("foo");
    });

    it("should call the transform fn", () => {
      transformFn.mockImplementation(() => highland([]));

      in$.write("foo");

      expect(transformFn).toHaveBeenCalledOnceWith("foo");
    });
  });
});

describe("match by id", () => {
  let data;
  beforeEach(() => {
    data = { 1: { id: 1, name: "a" }, 2: { id: 7, name: "b" }, 3: { id: 10, name: "c" } };
  });

  describe("given an array", () => {
    it("should match by the id", () => {
      const matcher = matchById(7);
      expect(matcher(Object.values(data))).toEqual(of({ id: 7, name: "b" }));
    });
  });

  describe("given an object", () => {
    it("should match by the id", () => {
      const matcher = matchById(7);
      expect(matcher(data)).toEqual(of({ id: 7, name: "b" }));
    });
  });
});

describe("filterSame", () => {
  it("should return bool on change / no change", () => {
    expect.assertions(3);
    const filter = filterSame(x => x.prop);

    expect(filter({ prop: "foo" })).toBe(true);
    expect(filter({ prop: "foo" })).toBe(false);
    expect(filter({ prop: "bar" })).toBe(true);
  });
});

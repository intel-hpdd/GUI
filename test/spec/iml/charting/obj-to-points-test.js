import highland from "highland";
import objToPoints from "../../../../source/iml/charting/obj-to-points.js";

describe("the obj to points plugin", function() {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  it("should convert obj to a points stream", function() {
    highland([
      {
        1: [
          {
            data: { foo: "bar" }
          }
        ]
      }
    ])
      .through(objToPoints)
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      data: { foo: "bar" },
      id: "1",
      name: "1"
    });
  });

  it("should convert objs to a points stream", function() {
    highland([
      {
        1: [{ data: { foo: "bar" } }, { data: { bar: "baz" } }],
        2: [{ data: { foo: "bap" } }],
        3: []
      }
    ])
      .through(objToPoints)
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { data: { foo: "bar" }, id: "1", name: "1" },
      { data: { bar: "baz" }, id: "1", name: "1" },
      { data: { foo: "bap" }, id: "2", name: "2" }
    ]);
  });
});

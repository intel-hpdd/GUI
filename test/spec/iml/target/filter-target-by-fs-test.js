import highland from "highland";
import filterTargetByFs from "../../../../source/iml/target/filter-target-by-fs.js";

describe("filter target by fs", () => {
  let data;

  beforeEach(() => {
    data = {
      1: {
        target: "foo",
        filesystems: [
          {
            id: 1
          }
        ]
      },
      2: {
        target: "bar",
        filesystems: [
          {
            id: 2
          }
        ]
      },
      3: {
        target: "baz",
        filesystem_id: 1
      }
    };
  });

  it("should return the targets with the matching fs", function() {
    let result;

    highland([data])
      .map(Object.values)
      .through(filterTargetByFs(1))
      .each(function(x) {
        result = x;
      });

    expect(result).toEqual([
      {
        target: "foo",
        filesystems: [
          {
            id: 1
          }
        ]
      },
      {
        target: "baz",
        filesystem_id: 1
      }
    ]);
  });

  it("should return nothing if id does not match", function() {
    const result = filterTargetByFs("4")([Object.values(data)]);

    expect(result).toEqual([[]]);
  });
});

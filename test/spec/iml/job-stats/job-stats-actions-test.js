// @flow

import { setSort, setDuration } from "../../../../source/iml/job-stats/job-stats-actions.js";

describe("job stats actions", () => {
  it("should set duration", () => {
    const resp = setDuration(5);

    expect(resp).toEqual({
      type: "SET_DURATION",
      payload: {
        duration: 5
      }
    });
  });

  it("should set sort", () => {
    const resp = setSort("read_bytes_average", true);

    expect(resp).toEqual({
      type: "SET_SORT",
      payload: {
        orderBy: "read_bytes_average",
        desc: true
      }
    });
  });
});

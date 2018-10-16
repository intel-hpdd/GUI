// @flow

import { render } from "inferno";
import highland from "highland";
import mockD3 from "d3";
import { flushD3Transitions } from "../../../test-utils.js";

describe("storage resource time series", () => {
  let mockSocketStream, mockBufferDataNewerThan, mockGetTimeParams, mockStream, StorageResourceTimeSeries, root;

  beforeEach(() => {
    mockStream = highland();
    mockSocketStream = jest.fn(() => mockStream);

    mockGetTimeParams = {
      getRequestDuration: jest.fn(() => () => x => ({
        ...x,
        qs: {
          ...x.qs,
          begin: "2017-08-08T20:30:00.000Z",
          end: "2017-08-08T20:40:00.000Z"
        }
      }))
    };

    mockBufferDataNewerThan = jest.fn(() => x => x);

    jest.mock("d3", () => mockD3);

    jest.mock("../../../../source/iml/charting/buffer-data-newer-than.js", () => mockBufferDataNewerThan);

    jest.mock("../../../../source/iml/charting/get-time-params.js", () => ({
      getTimeParams: mockGetTimeParams
    }));

    jest.mock("../../../../source/iml/socket/socket-stream.js", () => mockSocketStream);

    StorageResourceTimeSeries = require("../../../../source/iml/storage/storage-resource-time-series.js").default;

    root = document.createElement("div");

    const data = {
      type: "timeseries",
      title: "my first timeseries",
      series: [
        {
          label: "reads",
          name: "reads",
          type: "timeseries",
          data: null,
          unit_name: "reads"
        }
      ]
    };

    render(<StorageResourceTimeSeries resourceUri="/api/foo/bar/" chart={data} />, root);
    // $FlowFixMe: Mock for test
    Element.prototype.getTotalLength = () => 100;
    jest.useFakeTimers();
  });

  afterEach(() => {
    // $FlowFixMe: Mock for test
    delete Element.prototype.getTotalLength;
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should render when fetching data", () => {
    expect(root).toMatchSnapshot();
  });

  it("should call the socketStream", () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith(
      "/api/foo/bar/metric/",
      {
        qs: {
          begin: "2017-08-08T20:30:00.000Z",
          end: "2017-08-08T20:40:00.000Z",
          metrics: "reads"
        }
      },
      true
    );
  });

  it("should render empty data", () => {
    mockStream.write([]);
    mockStream.end();
    jest.runAllTimers();
    flushD3Transitions(mockD3);

    expect(root).toMatchSnapshot();
  });

  it("should render data", () => {
    mockStream.write([
      { data: { reads: 3 }, ts: "2017-08-08T20:32:40+00:00" },
      { data: { reads: 4 }, ts: "2017-08-08T20:32:50+00:00" }
    ]);
    mockStream.end();

    jest.runAllTimers();
    flushD3Transitions(mockD3);

    expect(root).toMatchSnapshot();
  });
});

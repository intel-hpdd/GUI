describe("create stream", () => {
  let createStream,
    streamWhenVisible,
    mockBufferDataNewerThan,
    mockGetTimeParams,
    requestRangeInner,
    requestDurationInner,
    mockFlushOnChange;

  beforeEach(() => {
    streamWhenVisible = jest.fn(() => "streamWhenVisible");
    mockBufferDataNewerThan = jest.fn(() => "bufferDataNewerThan");
    requestRangeInner = jest.fn(() => "requestRangeInner");
    requestDurationInner = jest.fn(() => "requestDurationInner");

    mockGetTimeParams = {
      getRequestRange: jest.fn(() => requestRangeInner),
      getRequestDuration: jest.fn(() => requestDurationInner)
    };

    mockFlushOnChange = jest.fn(x => x);

    jest.mock("../../../../source/iml/charting/buffer-data-newer-than.js", () => mockBufferDataNewerThan);
    jest.mock("../../../../source/iml/charting/get-time-params.js", () => ({
      getTimeParams: mockGetTimeParams
    }));
    jest.mock("../../../../source/iml/chart-transformers/chart-transformers.js", () => ({
      flushOnChange: mockFlushOnChange
    }));

    const mod = require("../../../../source/iml/charting/create-stream.js");

    createStream = mod.default(streamWhenVisible);
  });

  it("should return an object", () => {
    expect(createStream).toEqual({
      durationStream: expect.any(Function),
      rangeStream: expect.any(Function)
    });
  });

  describe("durationStream", () => {
    let durationStream, streamFn, overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jest.fn(() => "streamFn");

      overrides = {
        over: "rides"
      };

      begin = 5;
      end = 6;

      durationStream = createStream.durationStream(overrides)(streamFn, begin, end);
      createFn = streamWhenVisible.mock.calls[0][0];
    });

    it("should return stream when visible", () => {
      expect(durationStream).toEqual("streamWhenVisible");
    });

    it("should call getRequestDuration with overrides", () => {
      expect(mockGetTimeParams.getRequestDuration).toHaveBeenCalledOnceWith(overrides);
    });

    it("should call streamWhenVisible", () => {
      expect(streamWhenVisible).toHaveBeenCalledOnceWith(expect.any(Function));
    });

    it("should call request duration", () => {
      createFn();

      expect(requestDurationInner).toHaveBeenCalledOnceWith(5, 6);
    });

    it("should call bufferDataNewerThan", () => {
      createFn();

      expect(mockBufferDataNewerThan).toHaveBeenCalledOnceWith(5, 6);
    });

    it("should invoke the stream with args", () => {
      createFn();

      expect(streamFn).toHaveBeenCalledOnceWith("requestDurationInner", "bufferDataNewerThan");
    });
  });

  describe("rangeStream", () => {
    let rangeStream, streamFn, overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jest.fn(() => "streamFn");

      overrides = {
        over: "rides"
      };

      begin = 5;
      end = 6;

      rangeStream = createStream.rangeStream(overrides)(streamFn, begin, end);
      createFn = streamWhenVisible.mock.calls[0][0];
    });

    it("should return stream when visible", () => {
      expect(rangeStream).toEqual("streamWhenVisible");
    });

    it("should call getRequestRange with overrides", () => {
      expect(mockGetTimeParams.getRequestRange).toHaveBeenCalledOnceWith(overrides);
    });

    it("should call streamWhenVisible", () => {
      expect(streamWhenVisible).toHaveBeenCalledOnceWith(expect.any(Function));
    });

    it("should call flushOnChange", () => {
      expect(mockFlushOnChange).toHaveBeenCalledOnceWith("streamWhenVisible");
    });

    it("should call request range", () => {
      createFn();

      expect(requestRangeInner).toHaveBeenCalledOnceWith(5, 6);
    });

    it("should invoke the stream with args", () => {
      createFn();

      expect(streamFn).toHaveBeenCalledOnceWith("requestRangeInner", expect.any(Function));
    });
  });
});

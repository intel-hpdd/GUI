import {createStream as createStreamFactory}
  from '../../../../source/chroma_ui/iml/charting/create-stream-exports';

describe('create stream', function () {
  var createStream, streamWhenVisible,
    bufferDataNewerThan, getTimeParams,
    requestRangeInner, requestDurationInner;

  beforeEach(() => {
    streamWhenVisible = jasmine.createSpy('streamWhenVisible')
      .and.returnValue('streamWhenVisible');
    bufferDataNewerThan = jasmine.createSpy('bufferDataNewerThan')
      .and.returnValue('bufferDataNewerThan');

    requestRangeInner = jasmine.createSpy('requestRangeInner')
      .and.returnValue('requestRangeInner');

    requestDurationInner = jasmine.createSpy('requestDurationInner')
      .and.returnValue('requestDurationInner');

    getTimeParams = {
      getRequestRange: jasmine.createSpy('getRequestRange')
        .and.returnValue(requestRangeInner),
      getRequestDuration: jasmine.createSpy('getRequestDuration')
        .and.returnValue(requestDurationInner)
    };

    createStream = createStreamFactory(streamWhenVisible, bufferDataNewerThan, getTimeParams);
  });

  it('should return an object', () => {
    expect(createStream).toEqual({
      durationStream: jasmine.any(Function),
      rangeStream: jasmine.any(Function)
    });
  });

  describe('durationStream', () => {
    var durationStream, streamFn,
      overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jasmine.createSpy('streamFn')
      .and.returnValue('streamFn');

      overrides = {
        over: 'rides'
      };

      begin = 5;
      end = 6;

      durationStream = createStream.durationStream(streamFn, overrides, begin, end);
      createFn = streamWhenVisible.calls.mostRecent().args[0];
    });

    it('should return stream when visible', function () {
      expect(durationStream)
        .toEqual('streamWhenVisible');
    });

    it('should call getRequestDuration with overrides', () => {
      expect(getTimeParams.getRequestDuration)
        .toHaveBeenCalledOnceWith(overrides);
    });

    it('should call streamWhenVisible', () => {
      expect(streamWhenVisible)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should call request duration', function () {
      createFn();

      expect(requestDurationInner)
        .toHaveBeenCalledOnceWith(5, 6);
    });

    it('should call bufferDataNewerThan', () => {
      createFn();

      expect(bufferDataNewerThan)
        .toHaveBeenCalledOnceWith(5, 6);
    });

    it('should invoke the stream with args', () => {
      createFn();

      expect(streamFn)
        .toHaveBeenCalledOnceWith('requestDurationInner', 'bufferDataNewerThan');
    });
  });

  describe('rangeStream', () => {
    var rangeStream, streamFn,
      overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jasmine.createSpy('streamFn')
        .and.returnValue('streamFn');

      overrides = {
        over: 'rides'
      };

      begin = 5;
      end = 6;

      rangeStream = createStream.rangeStream(streamFn, overrides, begin, end);
      createFn = streamWhenVisible.calls.mostRecent().args[0];
    });

    it('should return stream when visible', function () {
      expect(rangeStream)
        .toEqual('streamWhenVisible');
    });

    it('should call getRequestRange with overrides', () => {
      expect(getTimeParams.getRequestRange)
        .toHaveBeenCalledOnceWith(overrides);
    });

    it('should call streamWhenVisible', () => {
      expect(streamWhenVisible)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });

    it('should call request range', function () {
      createFn();

      expect(requestRangeInner)
        .toHaveBeenCalledOnceWith(5, 6);
    });

    it('should invoke the stream with args', () => {
      createFn();

      expect(streamFn)
        .toHaveBeenCalledOnceWith('requestRangeInner', jasmine.any(Function));
    });
  });
});

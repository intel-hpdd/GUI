import { mock, resetAll } from '../../../system-mock.js';

describe('create stream', function() {
  let createStream,
    streamWhenVisible,
    bufferDataNewerThan,
    getTimeParams,
    requestRangeInner,
    requestDurationInner,
    flushOnChange;

  beforeEachAsync(async function() {
    streamWhenVisible = jasmine
      .createSpy('streamWhenVisible')
      .and.returnValue('streamWhenVisible');
    bufferDataNewerThan = jasmine
      .createSpy('bufferDataNewerThan')
      .and.returnValue('bufferDataNewerThan');

    requestRangeInner = jasmine
      .createSpy('requestRangeInner')
      .and.returnValue('requestRangeInner');

    requestDurationInner = jasmine
      .createSpy('requestDurationInner')
      .and.returnValue('requestDurationInner');

    getTimeParams = {
      getRequestRange: jasmine
        .createSpy('getRequestRange')
        .and.returnValue(requestRangeInner),
      getRequestDuration: jasmine
        .createSpy('getRequestDuration')
        .and.returnValue(requestDurationInner)
    };

    flushOnChange = jasmine.createSpy('flushOnChange').and.callFake(x => x);

    const mod = await mock('source/iml/charting/create-stream.js', {
      'source/iml/charting/buffer-data-newer-than.js': {
        default: bufferDataNewerThan
      },
      'source/iml/charting/get-time-params.js': { getTimeParams },
      'source/iml/chart-transformers/chart-transformers.js': { flushOnChange }
    });

    createStream = mod.default(streamWhenVisible);
  });

  afterEach(resetAll);

  it('should return an object', () => {
    expect(createStream).toEqual({
      durationStream: expect.any(Function),
      rangeStream: expect.any(Function)
    });
  });

  describe('durationStream', () => {
    let durationStream, streamFn, overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jasmine.createSpy('streamFn').and.returnValue('streamFn');

      overrides = {
        over: 'rides'
      };

      begin = 5;
      end = 6;

      durationStream = createStream.durationStream(
        overrides,
        streamFn,
        begin,
        end
      );
      createFn = streamWhenVisible.calls.mostRecent().args[0];
    });

    it('should return stream when visible', function() {
      expect(durationStream).toEqual('streamWhenVisible');
    });

    it('should call getRequestDuration with overrides', () => {
      expect(getTimeParams.getRequestDuration).toHaveBeenCalledOnceWith(
        overrides
      );
    });

    it('should call streamWhenVisible', () => {
      expect(streamWhenVisible).toHaveBeenCalledOnceWith(expect.any(Function));
    });

    it('should call request duration', function() {
      createFn();

      expect(requestDurationInner).toHaveBeenCalledOnceWith(5, 6);
    });

    it('should call bufferDataNewerThan', () => {
      createFn();

      expect(bufferDataNewerThan).toHaveBeenCalledOnceWith(5, 6);
    });

    it('should invoke the stream with args', () => {
      createFn();

      expect(streamFn).toHaveBeenCalledOnceWith(
        'requestDurationInner',
        'bufferDataNewerThan'
      );
    });
  });

  describe('rangeStream', () => {
    let rangeStream, streamFn, overrides, begin, end, createFn;

    beforeEach(() => {
      streamFn = jasmine.createSpy('streamFn').and.returnValue('streamFn');

      overrides = {
        over: 'rides'
      };

      begin = 5;
      end = 6;

      rangeStream = createStream.rangeStream(overrides, streamFn, begin, end);
      createFn = streamWhenVisible.calls.mostRecent().args[0];
    });

    it('should return stream when visible', function() {
      expect(rangeStream).toEqual('streamWhenVisible');
    });

    it('should call getRequestRange with overrides', () => {
      expect(getTimeParams.getRequestRange).toHaveBeenCalledOnceWith(overrides);
    });

    it('should call streamWhenVisible', () => {
      expect(streamWhenVisible).toHaveBeenCalledOnceWith(expect.any(Function));
    });

    it('should call flushOnChange', () => {
      expect(flushOnChange).toHaveBeenCalledOnceWith('streamWhenVisible');
    });

    it('should call request range', function() {
      createFn();

      expect(requestRangeInner).toHaveBeenCalledOnceWith(5, 6);
    });

    it('should invoke the stream with args', () => {
      createFn();

      expect(streamFn).toHaveBeenCalledOnceWith(
        'requestRangeInner',
        expect.any(Function)
      );
    });
  });
});

import highland from 'highland';

describe('stream', () => {
  let $document,
    mockPageVisibility,
    removeListener,
    mockVisibilityStream,
    streamFn,
    inStream,
    stream,
    documentHidden,
    documentVisible,
    mod,
    visibilityStream,
    streamWhenVisible,
    spy;

  beforeEach(() => {
    removeListener = jest.fn();
    mockPageVisibility = jest.fn().mockReturnValue(removeListener);
    jest.mock(
      '../../../../source/iml/page-visibility.js',
      () => mockPageVisibility
    );

    visibilityStream = highland();
    jest.spyOn(visibilityStream, 'destroy');

    mockVisibilityStream = jest.fn(() => visibilityStream);

    jest.mock('highland', () => mockVisibilityStream);

    mod = require('../../../../source/iml/stream-when-visible/stream-when-visible.js');

    $document = [{ hidden: false }];

    streamWhenVisible = mod.streamWhenVisible(
      $document,
      documentHidden,
      documentVisible
    );
  });

  describe('when visible', () => {
    beforeEach(() => {
      inStream = highland();
      jest.spyOn(inStream, 'destroy');
      streamFn = jest.fn(() => inStream);
      stream = streamWhenVisible(streamFn);
      jest.spyOn(stream, 'destroy');
      spy = jest.fn();
    });
    it('should be a function', () => {
      expect(streamWhenVisible).toEqual(expect.any(Function));
    });
    it('should return a stream', () => {
      expect(highland.isStream(stream)).toBe(true);
    });
    it('should call the page visibility service', () => {
      expect(mockPageVisibility).toHaveBeenCalledOnceWith(
        expect.any(Function),
        expect.any(Function),
        30000
      );
    });
    it('should pass errors to stream', () => {
      inStream.write({
        __HighlandStreamError__: true,
        error: new Error('boom!')
      });
      stream.errors(spy).each(() => {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should pass values to stream', () => {
      inStream.write('foo');
      stream.each(spy);
      expect(spy).toHaveBeenCalledOnceWith('foo');
    });
    it('should not write if document is hidden', () => {
      $document[0].hidden = true;
      inStream.write('foo');
      stream.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith('foo');
    });
    it('should write a document hidden token on page hidden', () => {
      mockPageVisibility.mock.calls[0][0]();
      stream.each(spy);
      expect(spy).toHaveBeenCalledOnceWith(documentHidden);
    });
    it('should destroy the stream on page hidden', () => {
      mockPageVisibility.mock.calls[0][0]();
      expect(inStream.destroy).toHaveBeenCalledTimes(1);
    });
    it('should write a document visible token on page visible', () => {
      mockPageVisibility.mock.calls[0][0]();
      mockPageVisibility.mock.calls[0][1]();
      stream.each(spy);
      expect(spy).toHaveBeenCalledWith(documentVisible);
      expect(spy).toHaveBeenCalledWith(documentHidden);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('when hidden', () => {
    beforeEach(() => {
      $document[0].hidden = true;
      inStream = highland();
      jest.spyOn(inStream, 'destroy');
      streamFn = jest.fn(() => inStream);
      stream = streamWhenVisible(streamFn);
      jest.spyOn(stream, 'destroy');
      inStream.write('foo');
    });
    it('should return a stream', () => {
      expect(highland.isStream(stream)).toBe(true);
    });
    it('should not call the stream fn', () => {
      expect(streamFn).not.toHaveBeenCalled();
    });
    it('should not write data', () => {
      stream.each(spy);
      expect(spy).not.toHaveBeenCalledOnceWith('foo');
    });

    describe('then shown', () => {
      beforeEach(() => {
        mockPageVisibility.mock.calls[0][1]();
      });
      it('should write data', () => {
        expect(spy);
      });
      it('should call the stream function', () => {
        expect(streamFn).toHaveBeenCalledTimes(1);
      });

      describe('on destroy', () => {
        beforeEach(() => {
          stream.destroy();
        });
        it('should destroy the stream', () => {
          expect(inStream.destroy).toHaveBeenCalledTimes(1);
        });
        it('should destroy the visibleStream', () => {
          expect(stream.destroy).toHaveBeenCalledTimes(1);
        });
        it('should remove the listener', () => {
          expect(removeListener).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

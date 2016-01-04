import {streamWhenVisible as streamWhenVisibleFactory}
  from '../../../../source/chroma_ui/iml/stream-when-visible/stream-when-visible-exports';

import {noop} from 'intel-fp/fp';

describe('stream when visible', () => {
  var $document, pageVisibility, removeListener, streamWhenVisible,
    visibilityStream, streamFn, inStream, stream, spy;

  beforeEach(() => {
    $document = {
      hidden: false
    };

    removeListener = jasmine.createSpy('removeListener');
    pageVisibility = jasmine.createSpy('pageVisibility')
      .and.returnValue(removeListener);

    spy = jasmine.createSpy('spy');

    streamWhenVisible = streamWhenVisibleFactory([$document], () => {
      visibilityStream = highland();
      spyOn(visibilityStream, 'destroy');

      return visibilityStream;
    }, pageVisibility);

    inStream = highland();
    spyOn(inStream, 'destroy');
    streamFn = jasmine.createSpy('streamFn')
      .and.returnValue(inStream);

    stream = streamWhenVisible(streamFn);
    spyOn(stream, 'destroy').and.callThrough();
  });

  it('should be a function', () => {
    expect(streamWhenVisible)
      .toEqual(jasmine.any(Function));
  });

  it('should return a stream', () => {
    expect(highland.isStream(stream))
      .toBe(true);
  });

  it('should call the page visibility service', () => {
    expect(pageVisibility)
      .toHaveBeenCalledOnceWith(jasmine.any(Function), jasmine.any(Function), 30000);
  });

  it('should pass errors to stream', () => {
    inStream.write({
      __HighlandStreamError__: true,
      error: new Error('boom!')
    });

    stream
      .errors(spy)
      .each(noop);

    expect(spy)
      .toHaveBeenCalledOnce();
  });

  it('should pass values to stream', () => {
    inStream.write('foo');

    stream
      .each(spy);

    expect(spy)
      .toHaveBeenCalledOnceWith('foo');
  });

  it('should not write if document is hidden', () => {
    $document.hidden = true;

    inStream.write('foo');

    stream
      .each(spy);

    expect(spy)
      .not
      .toHaveBeenCalledOnceWith('foo');
  });

  describe('when hidden', () => {
    beforeEach(() => {
      $document.hidden = true;

      inStream = highland();

      streamFn = jasmine.createSpy('streamFn')
        .and.returnValue(inStream);
      stream = streamWhenVisible(streamFn);

      inStream.write('foo');
    });

    it('should return a stream', () => {
      expect(highland.isStream(stream))
        .toBe(true);
    });

    it('should not call the stream fn', () => {
      expect(streamFn).not.toHaveBeenCalled();
    });

    it('should not write data', () => {
      stream
        .each(spy);

      expect(spy)
        .not
        .toHaveBeenCalledOnceWith('foo');
    });

    describe('then shown', () => {
      beforeEach(() => {
        pageVisibility.calls.mostRecent().args[1]();
      });

      it('should write data', () => {
        expect(spy);
      });

      it('should call the stream function', () => {
        expect(streamFn).toHaveBeenCalledOnce();
      });
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      stream.destroy();
    });

    it('should destroy the stream', () => {
      expect(inStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the visibleStream', () => {
      expect(stream.destroy).toHaveBeenCalledOnce();
    });

    it('should remove the listener', () => {
      expect(removeListener).toHaveBeenCalledOnce();
    });
  });
});

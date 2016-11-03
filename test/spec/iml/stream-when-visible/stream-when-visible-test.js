import highland from 'highland';
import * as fp from 'intel-fp';

import {
  mock,
  resetAll
} from '../../../system-mock.js';


import streamWhenVisibleModule from '../../../../source/iml/stream-when-visible/stream-when-visible-module';

describe('stream when visible', () => {
  var $document, pageVisibility, removeListener,
    visibilityStream, streamFn, inStream, stream,
    documentHidden, documentVisible, mod;

  beforeEachAsync(async function () {
    removeListener = jasmine.createSpy('removeListener');
    pageVisibility = jasmine.createSpy('pageVisibility')
      .and.returnValue(removeListener);

    mod = await mock('source/iml/stream-when-visible/stream-when-visible.js', {
      'source/iml/page-visibility.js': {
        default: pageVisibility
      }
    });
  });

  afterEach(resetAll);

  beforeEach(module(streamWhenVisibleModule, $provide => {
    $document = {
      hidden: false
    };
    $provide.value('$document', [$document]);

    $provide.value('highland', () => {
      visibilityStream = highland();
      spyOn(visibilityStream, 'destroy');

      return visibilityStream;
    });
    $provide.factory('streamWhenVisible', mod.streamWhenVisible);

    documentHidden = 'hidden';
    $provide.value('documentHidden', documentHidden);
    documentVisible = 'visible';
    $provide.value('documentVisible', documentVisible);
  }));

  var streamWhenVisible, spy;

  beforeEach(inject((_streamWhenVisible_) => {
    streamWhenVisible = _streamWhenVisible_;

    streamFn = jasmine.createSpy('streamFn')
      .and.callFake(() => {
        inStream = highland();
        spyOn(inStream, 'destroy');
        return inStream;
      });

    stream = streamWhenVisible(streamFn);
    spyOn(stream, 'destroy').and.callThrough();

    spy = jasmine.createSpy('spy');
  }));

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
      .each(fp.noop);

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

  it('should write a document hidden token on page hidden', () => {
    pageVisibility.calls.mostRecent().args[0]();

    stream.each(spy);

    expect(spy)
      .toHaveBeenCalledOnceWith(documentHidden);
  });

  it('should destroy the stream on page hidden', () => {
    pageVisibility.calls.mostRecent().args[0]();

    expect(inStream.destroy)
      .toHaveBeenCalledOnce();
  });

  it('should write a document visible token on page visible', () => {
    pageVisibility.calls.mostRecent().args[0]();
    pageVisibility.calls.mostRecent().args[1]();

    stream.each(spy);

    expect(spy)
      .toHaveBeenCalledOnceWith(documentVisible);
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

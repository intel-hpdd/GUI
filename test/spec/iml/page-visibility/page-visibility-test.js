import {
  mock,
  resetAll
} from '../../../system-mock.js';


describe('page visibility', () => {
  let doc, pageVisibility, clear;

  beforeEachAsync(async function () {
    doc = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    clear = jasmine.createSpy('clear');

    const mod = await mock('source/iml/page-visibility.js', {
      'source/iml/global.js': {
        default: {
          document: doc,
          clearTimeout: clear
        }
      }
    });

    pageVisibility = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => jasmine.clock().uninstall());

  afterEach(resetAll);

  it('should be a function', () => {
    expect(pageVisibility)
      .toEqual(jasmine.any(Function));
  });

  describe('when invoking', () => {
    var onHide, onShow, removeListener, handler;

    beforeEach(() => {
      onHide = jasmine.createSpy('onHide');
      onShow = jasmine.createSpy('onShow');
      removeListener = pageVisibility(onHide, onShow);
      handler = doc.addEventListener.calls.mostRecent().args[1];
    });

    it('should return a remove listener fn', () => {
      expect(removeListener)
        .toEqual(jasmine.any(Function));
    });

    it('should add an event listener', () => {
      expect(doc.addEventListener)
        .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
    });

    describe('when removing', () => {
      beforeEach(() => {
        doc.hidden = true;
        handler();
        removeListener();
      });

      it('should clear the timeout', function () {
        expect(clear)
          .toHaveBeenCalledOnce();
      });

      it('should remove the listener', () => {
        expect(doc.removeEventListener)
          .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
      });
    });

    describe('when changed', () => {
      it('should call hide', () => {
        doc.hidden = true;
        handler();
        jasmine.clock().tick(0);

        expect(onHide).toHaveBeenCalledOnceWith();
      });

      it('should call show', () => {
        doc.hidden = false;
        handler();
        jasmine.clock().tick(0);

        expect(onShow)
          .toHaveBeenCalledOnceWith(undefined);
      });

      it('should not call show if timeout is cancelled', () => {
        doc.hidden = true;
        handler();
        doc.hidden = false;
        handler();

        expect(onShow)
          .not
          .toHaveBeenCalled();
      });
    });
  });
});

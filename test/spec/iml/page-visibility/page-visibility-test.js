describe('page visibility', () => {
  let mockDoc, pageVisibility, mockClear;

  beforeEach(() => {
    mockDoc = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    mockClear = jasmine.createSpy('clear');

    jest.mock('../../../../source/iml/global.js', () => ({
      document: mockDoc,
      clearTimeout: mockClear
    }));

    pageVisibility = require('../../../../source/iml/page-visibility.js')
      .default;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be a function', () => {
    expect(pageVisibility).toEqual(jasmine.any(Function));
  });

  describe('when invoking', () => {
    let onHide, onShow, removeListener, handler;

    beforeEach(() => {
      onHide = jasmine.createSpy('onHide');
      onShow = jasmine.createSpy('onShow');
      removeListener = pageVisibility(onHide, onShow);
      handler = mockDoc.addEventListener.calls.mostRecent().args[1];
    });

    it('should return a remove listener fn', () => {
      expect(removeListener).toEqual(jasmine.any(Function));
    });

    it('should add an event listener', () => {
      expect(mockDoc.addEventListener).toHaveBeenCalledOnceWith(
        'visibilitychange',
        jasmine.any(Function)
      );
    });

    describe('when removing', () => {
      beforeEach(() => {
        mockDoc.hidden = true;
        handler();
        removeListener();
      });

      it('should clear the timeout', () => {
        expect(mockClear).toHaveBeenCalledTimes(1);
      });

      it('should remove the listener', () => {
        expect(mockDoc.removeEventListener).toHaveBeenCalledOnceWith(
          'visibilitychange',
          jasmine.any(Function)
        );
      });
    });

    describe('when changed', () => {
      it('should call hide', () => {
        mockDoc.hidden = true;
        handler();
        jest.runTimersToTime(0);

        expect(onHide).toHaveBeenCalledOnceWith();
      });

      it('should call show', () => {
        mockDoc.hidden = false;
        handler();
        jest.runTimersToTime(0);

        expect(onShow).toHaveBeenCalledOnceWith(undefined);
      });

      it('should not call show if timeout is cancelled', () => {
        mockDoc.hidden = true;
        handler();
        mockDoc.hidden = false;
        handler();

        expect(onShow).not.toHaveBeenCalled();
      });
    });
  });
});

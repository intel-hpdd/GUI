describe('page visibility', () => {
  let mockDoc, pageVisibility, mockClear;

  beforeEach(() => {
    jest.resetModules();
    mockDoc = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };

    mockClear = jest.fn();

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
    expect(pageVisibility).toEqual(expect.any(Function));
  });

  describe('when invoking', () => {
    let onHide, onShow, removeListener, handler;

    beforeEach(() => {
      onHide = jest.fn();
      onShow = jest.fn();
      removeListener = pageVisibility(onHide, onShow);
      handler = mockDoc.addEventListener.mock.calls[0][1];
    });

    it('should return a remove listener fn', () => {
      expect(removeListener).toEqual(expect.any(Function));
    });

    it('should add an event listener', () => {
      expect(mockDoc.addEventListener).toHaveBeenCalledOnceWith(
        'visibilitychange',
        expect.any(Function)
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
          expect.any(Function)
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

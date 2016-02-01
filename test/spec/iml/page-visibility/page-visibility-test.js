import pageVisibilityModule
  from '../../../../source/iml/page-visibility/page-visibility-module';


describe('page visibility', () => {
  var $document;

  beforeEach(module(pageVisibilityModule, $provide => {
    $document = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    $provide.value('$document', [$document]);
  }));

  var $timeout, pageVisibility;

  beforeEach(inject((_$timeout_, _pageVisibility_) => {
    $timeout = _$timeout_;
    spyOn($timeout, 'cancel');
    pageVisibility = _pageVisibility_;
  }));

  it('should be a function', () => {
    expect(pageVisibility)
      .toEqual(jasmine.any(Function));
  });

  describe('when invoking', () => {
    var onHide, onShow, removeListener;

    beforeEach(() => {
      onHide = jasmine.createSpy('onHide');
      onShow = jasmine.createSpy('onShow');
      removeListener = pageVisibility(onHide, onShow);
    });

    it('should return a remove listener fn', () => {
      expect(removeListener)
        .toEqual(jasmine.any(Function));
    });

    it('should add an event listener', () => {
      expect($document.addEventListener)
        .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
    });

    describe('when removing', () => {
      beforeEach(() => {
        removeListener();
      });

      it('should cancel the timeout', function () {
        expect($timeout.cancel)
          .toHaveBeenCalledOnceWith(undefined);
      });

      it('should remove the listener', () => {
        expect($document.removeEventListener)
          .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
      });
    });

    describe('when changed', () => {
      var handler;

      beforeEach(() => {
        handler = $document.addEventListener.calls.mostRecent().args[1];
      });

      it('should call hide', () => {
        $document.hidden = true;
        handler();
        $timeout.flush();

        expect(onHide).toHaveBeenCalledOnceWith();
      });

      it('should call show', () => {
        $document.hidden = false;
        $timeout.cancel.and.returnValue(false);
        handler();

        expect(onShow).toHaveBeenCalledOnceWith();
      });

      it('should not call show if timeout is cancelled', () => {
        $document.hidden = false;
        $timeout.cancel.and.returnValue(true);
        handler();

        expect(onShow).not.toHaveBeenCalled();
      });
    });
  });
});

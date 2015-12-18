describe('page visibility', () => {
  var $document;

  beforeEach(window.module('pageVisibility', ($provide) => {
    $document = {
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    $provide.value('$document', [$document]);
  }));

  var pageVisibility;

  beforeEach(inject((_pageVisibility_) => {
    pageVisibility = _pageVisibility_;
  }));

  it('should be a function', () => {
    expect(pageVisibility).toEqual(jasmine.any(Function));
  });

  describe('when invoking', () => {
    var onHide, onShow, removeListener;

    beforeEach(() => {
      onHide = jasmine.createSpy('onHide');
      onShow = jasmine.createSpy('onShow');
      removeListener = pageVisibility(onHide, onShow);
    });

    it('should return a remove listener fn', () => {
      expect(removeListener).toEqual(jasmine.any(Function));
    });

    it('should add an event listener', () => {
      expect($document.addEventListener)
        .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
    });

    it('should remove the listener when destroying', () => {
      removeListener();

      expect($document.removeEventListener)
        .toHaveBeenCalledOnceWith('visibilitychange', jasmine.any(Function));
    });

    describe('when changed', () => {
      var handler;

      beforeEach(() => {
        handler = $document.addEventListener.mostRecentCall.args[1];
      });

      it('should call hide', () => {
        $document.hidden = true;
        handler();

        expect(onHide).toHaveBeenCalledOnce();
      });

      it('should call show', () => {
        $document.hidden = false;
        handler();

        expect(onShow).toHaveBeenCalledOnce();
      });
    });
  });
});

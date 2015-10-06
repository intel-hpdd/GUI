describe('deferred command modal button', function () {
  var socketStream, openCommandModal, modalStream;

  beforeEach(module('command', 'templates', function ($provide) {
    socketStream = jasmine.createSpy('socketStream')
      .andReturn(highland());
    $provide.value('socketStream', socketStream);

    modalStream = highland();
    openCommandModal = jasmine.createSpy('openCommandModal')
      .andReturn({
        resultStream: modalStream
      });
    $provide.value('openCommandModal', openCommandModal);
  }));

  var $scope, cleanText, el, qs,
    waitingButton, commandDetailButton;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<deferred-cmd-modal-btn resource-uri="::resourceUri"></deferred-cmd-modal-btn>';

    $scope = $rootScope.$new();
    $scope.resourceUri = '/api/command/1/';

    cleanText = fp.flow(
      fp.lensProp('textContent'),
      fp.invokeMethod('trim', [])
    );

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    waitingButton = qs.bind(el, 'button[disabled]');
    commandDetailButton = qs.bind(el, '.cmd-detail-btn');
    $scope.$digest();
  }));

  it('should not show the waiting button', function () {
    expect(waitingButton()).not.toBeShown();
  });

  it('should show the detail button', function () {
    expect(commandDetailButton()).toBeShown();
  });

  it('should have the correct detail text', function () {
    expect(cleanText(commandDetailButton())).toBe('Details');
  });

  describe('when clicked', function () {
    beforeEach(function () {
      commandDetailButton().click();
    });

    it('should fetch the resource URI', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/api/command/1/');
    });

    it('should pass a stream to openCommandModal', function () {
      expect(openCommandModal).toHaveBeenCalledOnceWith(jasmine.any(Object));
    });

    it('should show the waiting button', function () {
      expect(waitingButton()).toBeShown();
    });

    it('should have the correct waiting text', function () {
      expect(cleanText(waitingButton())).toBe('Waiting');
    });

    describe('resolving the command', function () {
      beforeEach(function () {
        modalStream.write('all done!');
        $scope.$digest();
      });

      it('should show the detail button', function () {
        expect(commandDetailButton()).toBeShown();
      });

      it('should hide the waiting button', function () {
        expect(waitingButton()).not.toBeShown();
      });
    });
  });
});

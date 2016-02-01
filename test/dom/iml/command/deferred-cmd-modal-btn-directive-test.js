import highland from 'highland';
import {flow, lensProp, view, invokeMethod} from 'intel-fp';
import commandModule from '../../../../source/iml/command/command-module';

describe('deferred command modal button directive exports', () => {
  let socketStream, openCommandModal, modalStream, resolveStream, Stream;

  beforeEach(module(commandModule, ($provide) => {
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(highland());
    $provide.value('socketStream', socketStream);

    modalStream = highland();
    openCommandModal = jasmine.createSpy('openCommandModal')
      .and.returnValue({
        resultStream: modalStream
      });
    $provide.value('openCommandModal', openCommandModal);

    Stream = highland().constructor;

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    $provide.decorator('resolveStream', ($delegate, $q) => {
      'ngInject';

      return $delegate.and.returnValue($q.when());
    });

  }));

  let $scope, cleanText, el, qs,
    waitingButton, commandDetailButton;

  beforeEach(inject(($rootScope, $compile) => {
    const template = '<deferred-cmd-modal-btn resource-uri="::resourceUri"></deferred-cmd-modal-btn>';

    $scope = $rootScope.$new();
    $scope.resourceUri = '/api/command/1/';

    cleanText = flow(
      view(lensProp('textContent')),
      invokeMethod('trim', [])
    );

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    waitingButton = qs.bind(el, 'button[disabled]');
    commandDetailButton = qs.bind(el, '.cmd-detail-btn');
    $scope.$digest();
  }));


  it('should not show the waiting button', () => {
    expect(waitingButton()).not.toBeShown();
  });

  it('should show the detail button', () => {
    expect(commandDetailButton()).toBeShown();
  });

  it('should have the correct detail text', () => {
    expect(cleanText(commandDetailButton())).toBe('Details');
  });

  describe('when clicked', () => {
    beforeEach(() => {
      commandDetailButton().click();
    });

    it('should fetch the resource URI', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/api/command/1/');
    });

    it('should pass a stream resolveStream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(jasmine.any(Stream));
    });

    it('should pass a stream to openCommandModal', () => {
      expect(openCommandModal).toHaveBeenCalledOnceWith(jasmine.any(Object));
    });

    it('should show the waiting button', () => {
      expect(waitingButton()).toBeShown();
    });

    it('should have the correct waiting text', () => {
      expect(cleanText(waitingButton())).toBe('Waiting');
    });

    describe('resolving the command', () => {
      beforeEach(() => {
        modalStream.write('all done!');
        $scope.$digest();
      });

      it('should show the detail button', () => {
        expect(commandDetailButton()).toBeShown();
      });

      it('should hide the waiting button', () => {
        expect(waitingButton()).not.toBeShown();
      });
    });
  });
});

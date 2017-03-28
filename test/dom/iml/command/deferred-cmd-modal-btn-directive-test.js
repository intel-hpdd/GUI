import highland from 'highland';
import * as fp from 'intel-fp';
import commandModule from '../../../../source/iml/command/command-module';

import { mock, resetAll } from '../../../system-mock.js';

describe('deferred command modal button directive exports', () => {
  let socketStream,
    openCommandModal,
    modalStream,
    resolveStream,
    DeferredCommandModalBtnCtrl;

  beforeEachAsync(async function() {
    socketStream = jasmine
      .createSpy('socketStream')
      .and.returnValue(highland());

    resolveStream = jasmine
      .createSpy('resolveStream')
      .and.returnValue(Promise.resolve());

    const mod = await mock(
      'source/iml/command/deferred-cmd-modal-btn-controller.js',
      {
        'source/iml/socket/socket-stream.js': { default: socketStream },
        'source/iml/promise-transforms.js': { resolveStream }
      }
    );

    DeferredCommandModalBtnCtrl = mod.default;
  });

  afterEach(resetAll);

  beforeEach(
    module(commandModule, ($provide, $controllerProvider) => {
      modalStream = highland();
      openCommandModal = jasmine.createSpy('openCommandModal').and.returnValue({
        resultStream: modalStream
      });
      $provide.value('openCommandModal', openCommandModal);

      $controllerProvider.register(
        'DeferredCommandModalBtnCtrl',
        DeferredCommandModalBtnCtrl
      );
    })
  );

  let $scope, cleanText, el, qs, waitingButton, commandDetailButton;

  beforeEach(
    inject(($rootScope, $compile) => {
      const template = '<deferred-cmd-modal-btn resource-uri="::resourceUri"></deferred-cmd-modal-btn>';

      $scope = $rootScope.$new();
      $scope.resourceUri = '/api/command/1/';

      cleanText = fp.flow(
        fp.view(fp.lensProp('textContent')),
        fp.invokeMethod('trim', [])
      );

      el = $compile(template)($scope)[0];
      qs = el.querySelector.bind(el);
      waitingButton = qs.bind(el, 'button[disabled]');
      commandDetailButton = qs.bind(el, '.cmd-detail-btn');
      $scope.$digest();
    })
  );

  it('should not show the waiting button', () => {
    expect(waitingButton()).toBeNull();
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
      expect(highland.isStream(resolveStream.calls.argsFor(0)[0])).toBe(true);
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
        expect(waitingButton()).toBeNull();
      });
    });
  });
});

import highland from 'highland';
import * as fp from '@mfl/fp';
import {
  deferredCmdModalBtnDirective
} from '../../../../source/iml/command/deferred-cmd-modal-btn-directive.js';
import angular from '../../../angular-mock-setup.js';

describe('deferred command modal button directive exports', () => {
  let mockSocketStream,
    openCommandModal,
    modalStream,
    mockResolveStream,
    DeferredCommandModalBtnCtrl;

  beforeEach(() => {
    mockSocketStream = jest.fn(() => highland());
    mockResolveStream = jest.fn(() => Promise.resolve());

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));

    DeferredCommandModalBtnCtrl = require('../../../../source/iml/command/deferred-cmd-modal-btn-controller.js')
      .default;
  });

  beforeEach(
    angular.mock.module(($provide, $controllerProvider, $compileProvider) => {
      modalStream = highland();
      openCommandModal = jest.fn(() => ({
        resultStream: modalStream
      }));

      $provide.value('openCommandModal', openCommandModal);

      $controllerProvider.register(
        'DeferredCommandModalBtnCtrl',
        DeferredCommandModalBtnCtrl
      );

      $compileProvider.directive(
        'deferredCmdModalBtn',
        deferredCmdModalBtnDirective
      );
    })
  );

  let $scope, cleanText, el, qs, waitingButton, commandDetailButton;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template =
        '<deferred-cmd-modal-btn resource-uri="::resourceUri"></deferred-cmd-modal-btn>';

      $scope = $rootScope.$new();
      $scope.resourceUri = '/api/command/1/';

      cleanText = fp.flow(fp.view(fp.lensProp('textContent')), x => x.trim());
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
      expect(mockSocketStream).toHaveBeenCalledOnceWith('/api/command/1/');
    });

    it('should pass a stream resolveStream', () => {
      expect(highland.isStream(mockResolveStream.mock.calls[0][0])).toBe(true);
    });

    it('should pass a stream to openCommandModal', () => {
      expect(openCommandModal).toHaveBeenCalledOnceWith(expect.any(Object));
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

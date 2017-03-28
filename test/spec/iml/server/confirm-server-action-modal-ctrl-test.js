import serverModule from '../../../../source/iml/server/server-module';
import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('Confirm server action modal', () => {
  beforeEach(module(serverModule));

  let $scope,
    $uibModalInstance,
    hosts,
    convertedJob,
    action,
    socketStream,
    stream,
    confirmServer,
    ConfirmServerActionModalCtrl;

  beforeEachAsync(async function() {
    socketStream = jasmine.createSpy('socketStream').and.callFake(() => {
      return (stream = highland());
    });

    const mod = await mock(
      'source/iml/server/confirm-server-action-modal-ctrl.js',
      {
        'source/iml/socket/socket-stream.js': { default: socketStream }
      }
    );

    ConfirmServerActionModalCtrl = mod.default;
  });

  afterEach(resetAll);

  beforeEach(
    inject(($rootScope, $controller) => {
      $scope = $rootScope.$new();

      $uibModalInstance = {
        close: jasmine.createSpy('close'),
        dismiss: jasmine.createSpy('dismiss')
      };

      hosts = [{}];

      convertedJob = {
        class_name: 'foo',
        args: {
          host_id: '1'
        }
      };

      action = {
        value: 'Install Updates',
        message: 'Installing updates',
        convertToJob: jasmine
          .createSpy('convertToJob')
          .and.returnValue(convertedJob)
      };

      $controller(ConfirmServerActionModalCtrl, {
        $scope,
        $uibModalInstance,
        hosts,
        action
      });

      confirmServer = $scope.confirmServerActionModal;
    })
  );

  it('should set hosts on the scope', () => {
    expect(confirmServer.hosts).toBe(hosts);
  });

  it('should set the actionName on the scope', () => {
    expect(confirmServer.actionName).toEqual(action.value);
  });

  it('should set inProgress on the scope', () => {
    expect(confirmServer.inProgress).toBe(false);
  });

  describe('go', () => {
    beforeEach(() => {
      confirmServer.go();
    });

    it('should set inProgress to true', () => {
      expect(confirmServer.inProgress).toBe(true);
    });

    it('should post a command', () => {
      expect(socketStream).toHaveBeenCalledOnceWith(
        '/command',
        {
          method: 'post',
          json: {
            message: action.message,
            jobs: convertedJob
          }
        },
        true
      );
    });

    describe('acking the post', () => {
      it('should close the modal with data', () => {
        stream.write({
          foo: 'bar'
        });

        expect($uibModalInstance.close).toHaveBeenCalledOnceWith({
          foo: 'bar'
        });
      });

      it('should close the modal without data', () => {
        confirmServer.go(true);
        stream.write({ objects: [] });

        expect($uibModalInstance.close).toHaveBeenCalledOnceWith(null);
      });
    });
  });
});

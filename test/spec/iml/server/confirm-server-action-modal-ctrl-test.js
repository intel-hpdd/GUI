import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('Confirm server action modal', () => {
  let $scope,
    $uibModalInstance,
    hosts,
    convertedJob,
    action,
    mockSocketStream,
    stream,
    confirmServer,
    ConfirmServerActionModalCtrl;
  beforeEach(() => {
    mockSocketStream = jest.fn(() => {
      return (stream = highland());
    });

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    const mod = require('../../../../source/iml/server/confirm-server-action-modal-ctrl.js');
    ConfirmServerActionModalCtrl = mod.default;
  });

  beforeEach(
    angular.mock.inject($rootScope => {
      $scope = $rootScope.$new();
      $uibModalInstance = { close: jest.fn(), dismiss: jest.fn() };
      hosts = [{}];
      convertedJob = { class_name: 'foo', args: { host_id: '1' } };
      action = {
        value: 'Install Updates',
        message: 'Installing updates',
        convertToJob: jest.fn().mockReturnValue(convertedJob)
      };
      ConfirmServerActionModalCtrl($scope, $uibModalInstance, hosts, action);
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
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        '/command',
        {
          method: 'post',
          json: { message: action.message, jobs: convertedJob }
        },
        true
      );
    });
    describe('acking the post', () => {
      it('should close the modal with data', () => {
        stream.write({ foo: 'bar' });
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

import serverModule from '../../../../source/iml/server/server-module';
import λ from 'highland';

describe('Confirm server action modal', () => {
  beforeEach(module(serverModule));

  var $scope, $uibModalInstance, hosts, convertedJob,
    action, socketStream, stream, confirmServer;

  beforeEach(inject(($rootScope, $controller) => {
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
      convertToJob: jasmine.createSpy('convertToJob')
        .and.returnValue(convertedJob)
    };

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(() => {
        return (stream = λ());
      });

    $controller('ConfirmServerActionModalCtrl', {
      $scope,
      $uibModalInstance,
      hosts,
      action,
      socketStream
    });

    confirmServer = $scope.confirmServerActionModal;
  }));

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
      expect(socketStream).toHaveBeenCalledOnceWith('/command', {
        method: 'post',
        json: {
          message: action.message,
          jobs: convertedJob
        }
      }, true);
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

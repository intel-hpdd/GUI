describe('Confirm server action modal', function () {
  'use strict';

  beforeEach(module('server'));

  var $scope, $modalInstance, hosts, action, socketStream, stream, confirmServer;

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();

    $modalInstance = {
      close: jasmine.createSpy('close'),
      dismiss: jasmine.createSpy('dismiss')
    };

    hosts = [{}];

    action = {
      value: 'Install Updates',
      message: 'Installing updates',
      convertToJob: jasmine.createSpy('convertToJob').andReturn({
        class_name: 'foo',
        args: {
          host_id: '1'
        }
      })
    };

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(function () {
        return (stream = highland());
      });

    $controller('ConfirmServerActionModalCtrl', {
      $scope: $scope,
      $modalInstance: $modalInstance,
      hosts: hosts,
      action: action,
      socketStream: socketStream
    });

    confirmServer = $scope.confirmServerActionModal;
  }));

  it('should set hosts on the scope', function () {
    expect(confirmServer.hosts).toBe(hosts);
  });

  it('should set the actionName on the scope', function () {
    expect(confirmServer.actionName).toEqual(action.value);
  });

  it('should set inProgress on the scope', function () {
    expect(confirmServer.inProgress).toBe(false);
  });

  describe('go', function () {
    beforeEach(function () {
      confirmServer.go();
    });

    it('should set inProgress to true', function () {
      expect(confirmServer.inProgress).toBe(true);
    });

    it('should post a command', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/command', {
        method: 'post',
        json: {
          message: action.message,
          jobs: action.convertToJob.plan()
        }
      }, true);
    });

    describe('acking the post', function () {
      it('should close the modal with data', function () {
        stream.write({ objects: [] });

        expect($modalInstance.close).toHaveBeenCalledOnceWith([]);
      });

      it('should close the modal without data', function () {
        confirmServer.go(true);
        stream.write({ objects: [] });

        expect($modalInstance.close).toHaveBeenCalledOnceWith(undefined);
      });
    });
  });
});

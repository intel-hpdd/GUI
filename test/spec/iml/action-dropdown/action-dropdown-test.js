import angular from 'angular';
const {module, inject} = angular.mock;

describe('action dropdown', function () {
  beforeEach(module('action-dropdown-module'));

  var $scope, ctrl, handleAction, actionStream,
    getCommandStream, openCommandModal, commandStream,
    commandModalStream, s;

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();

    actionStream = highland();
    handleAction = jasmine.createSpy('handleAction')
      .andReturn(actionStream);

    commandStream = highland();
    spyOn(commandStream, 'destroy');
    getCommandStream = jasmine.createSpy('getCommandStream')
      .andReturn(commandStream);

    commandModalStream = highland();
    openCommandModal = jasmine.createSpy('openCommandModal')
      .andReturn({
        resultStream: commandModalStream
      });

    s = highland();

    ctrl = $controller('ActionDropdownCtrl', {
      $scope: $scope,
      actionDescriptionCache: {},
      handleAction: handleAction,
      getCommandStream: getCommandStream,
      openCommandModal: openCommandModal
    }, {
      stream: s
    });
  }));

  it('should setup the controller', function () {
    expect(ctrl).toEqual({
      actionDescriptionCache: {},
      handleAction: jasmine.any(Function),
      stream: s
    });
  });

  describe('handleAction', function () {
    beforeEach(function () {
      ctrl.handleAction(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should call handle action with record and action', function () {
      expect(handleAction).toHaveBeenCalledOnceWith(
        {
          record: 'record'
        },
        {
          action: 'action'
        }
      );
    });

    it('should get a command stream from the command', function () {
      actionStream.write({
        command: 'command'
      });

      expect(getCommandStream).toHaveBeenCalledOnceWith(['command']);
    });

    it('should open the command modal', function () {
      actionStream.write('command');

      expect(openCommandModal).toHaveBeenCalledOnceWith(commandStream);
    });

    it('should destroy the command stream when the modal gets a result', function () {
      actionStream.write('command');
      commandModalStream.write('done');

      expect(commandStream.destroy).toHaveBeenCalledOnce();
    });


  });
});

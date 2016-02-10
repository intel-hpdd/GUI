import angular from 'angular';
const {module, inject} = angular.mock;

describe('command modal', function () {
  beforeEach(module('command'));

  describe('open command modal', function () {
    var $uibModal, stream;

    beforeEach(module(function ($provide) {
      $uibModal = {
        open: jasmine.createSpy('open')
      };

      $provide.value('$uibModal', $uibModal);
    }));

    beforeEach(inject(function (openCommandModal) {
      stream = jasmine.createSpy('stream');

      openCommandModal(stream);
    }));

    it('should open the modal', function () {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        templateUrl: 'iml/command/assets/html/command-modal.html',
        controller: 'CommandModalCtrl',
        controllerAs: 'commandModal',
        windowClass: 'command-modal',
        backdrop: 'static',
        backdropClass: 'command-modal-backdrop',
        resolve: {
          commandsStream: jasmine.any(Function)
        }
      });
    });

    describe('commands', function () {
      var handle, commandStream;

      beforeEach(function () {
        handle = $uibModal.open.calls.mostRecent().args[0].resolve.commandsStream;
        commandStream = handle();
      });

      it('should provide a command stream', function () {
        expect(commandStream).toEqual(stream);
      });
    });
  });

  describe('command modal ctrl', function () {
    var commandsStream, commandModal;

    beforeEach(inject(function ($rootScope, $controller) {
      commandsStream = highland();

      commandModal = $controller('CommandModalCtrl', {
        commandsStream: commandsStream,
        $scope: $rootScope.$new()
      });
    }));

    it('should open the first accordion', function () {
      expect(commandModal.accordion0).toBe(true);
    });

    var states = {
      cancelled: { cancelled: true },
      failed: { errored: true },
      succeeded: { complete: true },
      pending: {
        cancelled: false,
        failed: false,
        complete: false
      }
    };

    Object.keys(states).forEach(function testState (state) {
      it('should be in state ' + state, function () {
        commandsStream.write(wrap(states[state]));

        var expected = angular.extend({
          state: state,
          jobs: []
        }, states[state]);

        expect(commandModal.commands).toEqual(wrap(expected));
      });
    });

    it('should trim logs', function () {
      commandsStream.write(wrap({
        logs: '    '
      }));

      expect(commandModal.commands).toEqual([{
        id: 1,
        logs: '',
        jobs: [],
        state: 'pending'
      }]);
    });

    function wrap () {
      var commands = [].slice.call(arguments, 0);

      return commands.map(function (command, index) {
        return angular.extend({
          id: index + 1,
          logs: '',
          jobs: []
        }, command);
      });
    }
  });
});

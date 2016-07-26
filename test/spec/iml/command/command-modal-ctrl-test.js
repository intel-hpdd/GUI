import commandModule from '../../../../source/iml/command/command-module';
import highland from 'highland';
import angular from 'angular';

describe('command modal', () => {
  beforeEach(module(commandModule));

  describe('open command modal', () => {
    var $uibModal, stream;

    beforeEach(module($provide => {
      $uibModal = {
        open: jasmine.createSpy('open')
      };

      $provide.value('$uibModal', $uibModal);
    }));

    beforeEach(inject(openCommandModal => {
      stream = jasmine.createSpy('stream');

      openCommandModal(stream);
    }));

    it('should open the modal', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        templateUrl: '/static/chroma_ui/source/iml/command/assets/html/command-modal.js',
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

    describe('commands', () => {
      var handle, commandStream;

      beforeEach(() => {
        handle = $uibModal.open.calls.mostRecent().args[0].resolve.commandsStream;
        commandStream = handle();
      });

      it('should provide a command stream', () => {
        expect(commandStream).toEqual(stream);
      });
    });
  });

  describe('command modal ctrl', () => {
    var commandsStream, commandModal;

    beforeEach(inject(($rootScope, $controller) => {
      commandsStream = highland();

      commandModal = $controller('CommandModalCtrl', {
        commandsStream: commandsStream,
        $scope: $rootScope.$new()
      });
    }));

    it('should open the first accordion', () => {
      expect(commandModal.accordion0).toBe(true);
    });

    const states = {
      cancelled: { cancelled: true },
      failed: { errored: true },
      succeeded: { complete: true },
      pending: {
        cancelled: false,
        failed: false,
        complete: false
      }
    };

    Object.keys(states).forEach((state) => {
      it(`should be in state ${state}`, () => {
        commandsStream.write(wrap(states[state]));

        var expected = angular.extend({
          state: state,
          jobs: []
        }, states[state]);

        expect(commandModal.commands).toEqual(wrap(expected));
      });
    });

    it('should trim logs', () => {
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

      return commands.map((command, index) => {
        return angular.extend({
          id: index + 1,
          logs: '',
          jobs: []
        }, command);
      });
    }
  });
});

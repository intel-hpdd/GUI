describe('command modal', function () {
  'use strict';

  beforeEach(module('command'));

  describe('open command modal', function () {
    var $modal, stream;

    beforeEach(module(function ($provide) {
      $modal = {
        open: jasmine.createSpy('open')
      };

      $provide.value('$modal', $modal);
    }));

    beforeEach(inject(function (openCommandModal) {
      stream = jasmine.createSpy('stream');

      openCommandModal(stream);
    }));

    it('should open the modal', function () {
      expect($modal.open).toHaveBeenCalledOnceWith({
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
        handle = $modal.open.mostRecentCall.args[0].resolve.commandsStream;
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

    it('should set the commands on the command modal', function () {
      commandsStream.write([{ foo: 'bar' }]);

      expect(commandModal.commands).toEqual([{ foo: 'bar' }]);
    });
  });
});

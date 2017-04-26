import { mock, resetAll } from '../../../system-mock.js';

import highland from 'highland';

describe('command modal', () => {
  let CommandModalCtrl, $uibModal, stream;

  beforeEach(module('extendScope'));

  beforeEachAsync(async function() {
    $uibModal = {
      open: jasmine.createSpy('open')
    };

    stream = jasmine.createSpy('stream');

    const mod = await mock('source/iml/command/command-modal-ctrl.js', {
      'source/iml/command/assets/html/command-modal.html': {
        default: 'commandModalTemplate'
      }
    });

    mod.openCommandModalFactory($uibModal)(stream);
    CommandModalCtrl = mod.CommandModalCtrl;
  });

  afterEach(resetAll);

  describe('open command modal', () => {
    it('should open the modal', () => {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        template: 'commandModalTemplate',
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
      let handle, commandStream;

      beforeEach(() => {
        handle = $uibModal.open.calls.mostRecent().args[0].resolve
          .commandsStream;
        commandStream = handle();
      });

      it('should provide a command stream', () => {
        expect(commandStream).toEqual(stream);
      });
    });
  });

  describe('ctrl', () => {
    let commandsStream, commandModal;

    beforeEach(
      inject(($rootScope, propagateChange) => {
        commandsStream = highland();

        commandModal = new CommandModalCtrl(
          commandsStream,
          $rootScope.$new(),
          propagateChange
        );
      })
    );

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

    Object.keys(states).forEach(state => {
      it(`should be in state ${state}`, () => {
        commandsStream.write(wrap(states[state]));

        const expected = Object.assign(
          {
            state: state,
            jobs: []
          },
          states[state]
        );

        expect(commandModal.commands).toEqual(wrap(expected));
      });
    });

    it('should trim logs', () => {
      commandsStream.write(
        wrap({
          logs: '    '
        })
      );

      expect(commandModal.commands).toEqual([
        {
          id: 1,
          logs: '',
          jobs: [],
          state: 'pending'
        }
      ]);
    });

    function wrap() {
      const commands = [].slice.call(arguments, 0);

      return commands.map((command, index) => {
        return Object.assign(
          {
            id: index + 1,
            logs: '',
            jobs: []
          },
          command
        );
      });
    }
  });
});

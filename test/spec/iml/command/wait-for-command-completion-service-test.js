import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('wait-for-command-completion-service', () => {
  let getCommandStream,
    commandStream,
    spy,
    resultStream,
    openCommandModal,
    waitForCommandCompletion;

  beforeEachAsync(async function() {
    commandStream = highland();
    spyOn(commandStream, 'destroy').and.callThrough();
    getCommandStream = jasmine
      .createSpy('getCommandStream')
      .and.returnValue(commandStream);

    spy = jasmine.createSpy('spy');
    resultStream = highland();
    openCommandModal = jasmine.createSpy('openCommandModal').and.returnValue({
      resultStream
    });

    const mod = await mock(
      'source/iml/command/wait-for-command-completion-service.js',
      {
        'source/iml/command/get-command-stream.js': {
          default: getCommandStream
        }
      }
    );

    waitForCommandCompletion = mod.default(openCommandModal);

    jasmine.clock().install();
  });

  afterEach(resetAll);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('contains commands', () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [{}];

      waitForCommandCompletion(false, responseWithCommands).each(spy);
    });

    it('should call get command stream', () => {
      expect(getCommandStream).toHaveBeenCalledWith([{}]);
    });

    it('should not call openCommandModal', () => {
      expect(openCommandModal).not.toHaveBeenCalled();
    });

    describe('on finish', () => {
      let data;

      beforeEach(() => {
        data = [
          {
            complete: true
          }
        ];

        commandStream.write(data);
      });

      it('should destroy the command stream', () => {
        jasmine.clock().tick();

        expect(commandStream.destroy).toHaveBeenCalledTimes(1);
      });

      it('should resolve the result', () => {
        expect(spy).toHaveBeenCalledOnceWith([
          {
            complete: true,
            state: 'succeeded'
          }
        ]);
      });
    });
  });

  describe('opening the command modal', () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [{}];

      waitForCommandCompletion(true, responseWithCommands);
    });

    it('should call openCommandModal', () => {
      expect(openCommandModal).toHaveBeenCalledOnceWith(expect.any(Object));
    });

    describe('closing the command modal', () => {
      beforeEach(() => {
        resultStream.write('close modal');
      });

      it('should destroy the commandModal$', () => {
        const commandModal$ = openCommandModal.calls.argsFor(0)[0];
        expect(commandModal$.ended).toBe(true);
      });

      it('should not destroy the command stream', () => {
        expect(commandStream.ended).toBe(false);
      });
    });
  });
});

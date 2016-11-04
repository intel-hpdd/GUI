import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('wait-for-command-completion-service', () => {
  let getCommandStream, commandStream, spy,
    openCommandModal, waitForCommandCompletion;

  beforeEachAsync(async function () {
    commandStream = highland();
    spyOn(commandStream, 'destroy')
      .and
      .callThrough();
    getCommandStream = jasmine
      .createSpy('getCommandStream')
      .and
      .returnValue(commandStream);

    spy = jasmine.createSpy('spy');
    openCommandModal = jasmine
      .createSpy('openCommandModal')
      .and
      .returnValue({
        resultStream: highland()
      });

    const mod = await mock(
      'source/iml/command/wait-for-command-completion-service.js', {
        'source/iml/command/get-command-stream.js': {
          default: getCommandStream
        }
      });

    waitForCommandCompletion = mod.default(
      openCommandModal
    );

    jasmine.clock().install();
  });

  afterEach(resetAll);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('contains commands', () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [
        {}
      ];

      waitForCommandCompletion(false, responseWithCommands)
        .each(spy);
    });

    it('should call get command stream', () => {
      expect(getCommandStream)
        .toHaveBeenCalledWith([
          {}
        ]);
    });

    it('should not call openCommandModal', () => {
      expect(openCommandModal)
        .not
        .toHaveBeenCalled();
    });

    describe('on finish', () => {
      let data;

      beforeEach(() => {
        data = [
          {
            complete: true
          }
        ];

        commandStream
          .write(
            data
          );
      });

      it('should destroy the command stream', () => {
        jasmine.clock().tick();

        expect(commandStream.destroy)
          .toHaveBeenCalledOnce();
      });

      it('should resolve the result', () => {
        expect(spy)
          .toHaveBeenCalledOnceWith([
            {
              complete: true,
              state: 'succeeded'
            }
          ]);
      });
    });
  });
});

import highland from 'highland';

describe('wait-for-command-completion-service', () => {
  let mockGetCommandStream,
    commandStream,
    spy,
    mockResultStream,
    openCommandModal,
    waitForCommandCompletion;

  beforeEach(() => {
    commandStream = highland();
    jest.spyOn(commandStream, 'destroy');
    mockGetCommandStream = jest.fn(() => commandStream);

    spy = jest.fn();
    mockResultStream = highland();
    openCommandModal = jest.fn(() => ({
      resultStream: mockResultStream
    }));

    jest.mock(
      '../../../../source/iml/command/get-command-stream.js',
      () => mockGetCommandStream
    );

    const mod = require('../../../../source/iml/command/wait-for-command-completion-service.js');

    waitForCommandCompletion = mod.default(openCommandModal);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('contains commands', () => {
    let responseWithCommands;

    beforeEach(() => {
      responseWithCommands = [{}];

      waitForCommandCompletion(false, responseWithCommands).each(spy);
    });

    it('should call get command stream', () => {
      expect(mockGetCommandStream).toHaveBeenCalledWith([{}]);
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
        jest.runAllTimers();

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
        mockResultStream.write('close modal');
      });

      it('should destroy the commandModal$', () => {
        const commandModal$ = openCommandModal.mock.calls[0][0];
        expect(commandModal$.ended).toBe(true);
      });

      it('should not destroy the command stream', () => {
        expect(commandStream.ended).toBe(false);
      });
    });
  });
});


import highland from 'highland';
import {noop} from 'intel-fp';
import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('wait-for-command-completion-service', function () {
  var getCommandStream, commandStream, spy,
    openCommandModal, waitForCommandCompletion,
    waitForCommandCompletionModule;

  beforeEachAsync(async function () {
    commandStream = highland();
    getCommandStream = jasmine.createSpy('getCommandStream')
      .and.returnValue(commandStream);

    waitForCommandCompletionModule = await mock(
      'source/iml/command/wait-for-command-completion-service.js', {
        'source/iml/command/get-command-stream.js': { default: getCommandStream }
      });
  });

  afterEach(resetAll);

  beforeEach(function () {
    spy = jasmine.createSpy('spy');

    const commandState = {
      CANCELLED: 'cancelled',
      FAILED: 'failed',
      SUCCEEDED: 'succeeded',
      PENDING: 'pending',
      WAITING: 'waiting to run',
      RUNNING: 'running'
    };
    openCommandModal = jasmine.createSpy('openCommandModal');

    var throwIfServerErrors = function throwIfServerErrors (fn) {
      return function throwOrCall (response) {
        if (response.errors && response.errors.length)
          throw new Error(JSON.stringify(response.errors));

        return fn(response);
      };
    };

    waitForCommandCompletion = waitForCommandCompletionModule.default(
      commandState, openCommandModal, throwIfServerErrors);
  });

  describe('response with errors', function () {
    var response;

    beforeEach(function () {
      response = {
        errors: [
          { message: 'error message' }
        ]
      };
    });

    it('should throw an exception', function () {
      var stream = waitForCommandCompletion(true, response);

      expect(callWaitForCommandCompletion)
        .toThrow(new Error(JSON.stringify([
          { message: 'error message' }
        ])));

      function callWaitForCommandCompletion () {
        stream.each(noop);
      }
    });
  });

  describe('no commands', function () {
    [
      {
        commands: []
      },
      {
        objects: [
          {
            no: 'commands'
          }
        ]
      }
    ].forEach(function handleResponse (response) {
      var result;

      beforeEach(function () {
        result = waitForCommandCompletion(true, response);
      });

      it('should return a stream', function () {
        expect(result).toEqual(jasmine.any(highland().constructor));
      });

      it('should resolve with the response that was passed in initially', function () {
        result.each(spy);

        expect(spy).toHaveBeenCalledOnceWith(response);
      });
    });
  });

  describe('contains finished commands', function () {
    var responseWithCommands;

    beforeEach(function () {
      responseWithCommands = [
        {
          arg: 'arg',
          command: { state: 'finished' }
        }
      ];

      waitForCommandCompletion(false, responseWithCommands)
        .each(spy);
    });

    it('should call get command stream', function () {
      expect(getCommandStream).toHaveBeenCalledWith([{ state: 'finished' }]);
    });

    it('should not call openCommandModal', function () {
      expect(openCommandModal).not.toHaveBeenCalled();
    });

    describe('on data', function () {
      var data;

      beforeEach(function () {
        data = [
          {
            state: 'not pending'
          }
        ];

        commandStream.write(data);
      });

      it('should destroy the command stream', function (done) {
        const spy = jasmine.createSpy('spy');

        commandStream._destructors.push(spy);
        commandStream._destructors.push(() => {
          expect(spy).toHaveBeenCalledOnce();
          done();
        });
      });

      it('should resolve the result', function () {
        expect(spy).toHaveBeenCalledOnceWith(responseWithCommands);
      });
    });
  });
});

import angular from 'angular';
const {module, inject} = angular.mock;

describe('wait-for-command-completion-service', function () {
  'use strict';

  var getCommandStream, openCommandModal, waitForCommandCompletion;

  beforeEach(module('command', function ($provide) {
    getCommandStream = jasmine.createSpy('getCommandStream')
      .andReturn(highland());
    spyOn(getCommandStream.plan(), 'destroy');
    $provide.value('getCommandStream', getCommandStream);

    openCommandModal = jasmine.createSpy('openCommandModal');
    $provide.value('openCommandModal', openCommandModal);

    var throwIfServerErrors = function throwIfServerErrors (fn) {
      return function throwOrCall (response) {
        if (_.compact(response.errors).length)
          throw new Error(JSON.stringify(response.errors));

        return fn(response);
      };
    };
    $provide.value('throwIfServerErrors', throwIfServerErrors);
  }));

  var spy;

  beforeEach(inject(function (_waitForCommandCompletion_) {
    waitForCommandCompletion = _waitForCommandCompletion_;

    spy = jasmine.createSpy('spy');
  }));

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
        stream.each(_.noop);
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

        getCommandStream.plan().write(data);
      });

      it('should destroy the command stream', function () {
        waitsFor(function () {
          return getCommandStream.plan().destroy.callCount > 0;
        }, 'Destroy should be called', 750);

        runs(function () {
          expect(getCommandStream.plan().destroy).toHaveBeenCalledOnce();
        });
      });

      it('should resolve the result', function () {
        expect(spy).toHaveBeenCalledOnceWith(responseWithCommands);
      });
    });
  });
});

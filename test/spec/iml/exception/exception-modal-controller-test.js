import _ from 'intel-lodash-mixins';
import highland from 'highland';
import exceptionModule from '../../../../source/iml/exception/exception-module';

describe('Exception modal controller', () => {
  var $scope, createController, getMessage, plainError, responseError,
    stackTraceContainsLineNumber, sendStackTraceToRealTime, s,
    reverseStream, socketStream;

  beforeEach(module(exceptionModule, function ($provide) {
    reverseStream = highland();

    socketStream = jasmine.createSpy('socketStream').and.returnValue(reverseStream);
    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();

    plainError = new Error('Error');

    responseError = new Error('Response Error');

    responseError.response = {
      status: 500,
      headers: {},
      data: {
        error_message: '',
        traceback: ''
      },
      config: {
        method:  'POST',
        url: '/api/foo/bar/',
        headers: {},
        data: {}
      }
    };

    stackTraceContainsLineNumber = jasmine.createSpy('stackTraceContainsLineNumber').and.returnValue(true);
    s = highland();
    sendStackTraceToRealTime = jasmine.createSpy('sendStackTraceToRealTime').and.returnValue(s);

    createController = function createController (deps) {
      deps = _.extend({
        $scope: $scope,
        sendStackTraceToRealTime: sendStackTraceToRealTime,
        stackTraceContainsLineNumber: stackTraceContainsLineNumber
      }, deps);

      $controller('ExceptionModalCtrl', deps);
    };

    getMessage = function getMessage (name) {
      return $scope.exceptionModal.messages.filter(function (message) {
        return message.name === name;
      }).pop();
    };
  }));

  it('should convert a string cause to a message', function () {
    plainError.cause = 'fooz';

    createController({
      exception: plainError
    });

    expect(getMessage('cause')).toEqual({name: 'cause', value: 'fooz'});
  });

  it('should return the expected messages for a plain error', function () {
    //Patch the stack as it becomes inconsistent as it's moved around.
    plainError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({cause: null, exception: plainError});

    expect($scope.exceptionModal.messages).toEqual([
      {name: 'name', value: 'Error'},
      {name: 'message', value: 'Error'},
      {name: 'Client Stack Trace', value: 'ERROOR!'}
    ]);
  });

  it('should return the expected messages for a response error', function () {
    //Patch the stack as it becomes inconsistent as it's moved around.
    responseError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({cause: null, exception: responseError});

    expect($scope.exceptionModal.messages).toEqual([
      {name: 'name', value: 'Error'},
      {name: 'message', value: 'Response Error'},
      {name: 'Client Stack Trace', value: 'ERROOR!'},
      {name: 'Response Status', value: 500},
      {name: 'Response Headers', value: '{}'},
      {name: 'method', value: 'POST'},
      {name: 'url', value: '/api/foo/bar/'},
      {name: 'Request Headers', value: '{}'},
      {name: 'data', value: '{}'}
    ]);
  });

  it('should not throw when handling a plain error', function () {
    function create () {
      createController({cause: null, exception: plainError});
    }

    expect(create).not.toThrow();
  });

  describe('handling non-strings when expecting multiline', function () {
    var create;

    beforeEach(function () {
      responseError.stack = 5;

      create = function () {
        createController({cause: null, exception: responseError});
      };
    });

    it('should handle non-strings when expecting a multiline one', function () {
      expect(create).not.toThrow();
    });

    it('should print the string representation of the value', function () {
      create();

      expect(getMessage('Client Stack Trace')).toEqual({name: 'Client Stack Trace', value: '5'});
    });
  });

  describe('circular references', function () {
    beforeEach(function () {
      responseError.response.config.data.foo = responseError.response;
    });

    it('should not throw when handling a circular reference', function () {
      function create () {
        createController({cause: null, exception: responseError});
      }

      expect(create).not.toThrow();
    });

    it('should return the string representation of the cyclic structure', function () {
      createController({cause: null, exception: responseError});

      expect(getMessage('data')).toEqual({name: 'data', value: '[object Object]'});
    });
  });

  describe('stack trace format from server', function () {
    beforeEach(function () {
      plainError.statusCode = '400';

      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    it('should add the status code to the output', function () {
      expect(getMessage('Status Code')).toEqual({
        name: 'Status Code',
        value: '400'
      });
    });

    it('should not call sendStackTraceToRealTime', function () {
      expect(sendStackTraceToRealTime).not.toHaveBeenCalled();
    });

    it('should have a loadingStack value of undefined', function () {
      expect($scope.exceptionModal.loadingStack).toEqual(undefined);
    });
  });

  describe('stack trace format in production mode', function () {
    beforeEach(function () {
      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    describe('before resolving', function () {
      it('should call stackTraceContainsLineNumber', function () {
        expect(stackTraceContainsLineNumber).toHaveBeenCalled();
      });

      it('should call sendStackTraceToRealTime', function () {
        expect(sendStackTraceToRealTime).toHaveBeenCalled();
      });

      it('should have a loadingStack value of true', function () {
        expect($scope.exceptionModal.loadingStack).toEqual(true);
      });
    });

    describe('after de-uglifying', function () {
      var formattedStackTrace = 'formattedStackTrace';

      beforeEach(function () {
        s.write({ stack: formattedStackTrace });
        s.end();
      });

      it('should have a loadingStack value of false', function () {
        expect($scope.exceptionModal.loadingStack).toEqual(false);
      });

      it('should have the formatted stack trace', function () {
        expect(_.find($scope.exceptionModal.messages, { name: 'Client Stack Trace' }).value)
          .toEqual(formattedStackTrace);
      });
    });
  });

  describe('stack trace contains line number factory', function () {
    var stackTraceContainsLineNumberFactory;
    beforeEach(inject(function (_stackTraceContainsLineNumber_) {
      stackTraceContainsLineNumberFactory = _stackTraceContainsLineNumber_;
    }));

    [
      {stack: 'at some-file-location/file.js:85:13'},
      {stack: 'some-file-location/file.js:85:13)'},
      {stack: 'at some-file-location/file.js:85:13 '},
      {stack: 'at some-file-location/file.js:85:13adsf'},
      {stack: 'some-file-location/file.js:85:13 more text'}
    ].forEach(function checkForLineAndColumnNumbers (stack) {
      describe('contains line number', function () {
        it('should indicate that ' + stack.stack + ' contains line numbers and columns', function () {
          expect(stackTraceContainsLineNumberFactory(stack)).toEqual(true);
        });
      });
    });

    [
      {stack: 'at some-file-location/file.js:85'},
      {stack: 'at some-file-location/file.js:85:'},
      {stack: 'at some-file-location/file.js:8513'}
    ].forEach(function checkForLineAndColumnNumbers (stack) {
      describe('does not contain line number', function () {
        it('should indicate that ' + stack.stack + ' doesn\'t contain both line and column numbers', function () {
          expect(stackTraceContainsLineNumberFactory(stack)).toEqual(false);
        });
      });
    });
  });

  describe('send stack trace to real time factory', function () {
    var exception, sendStackTraceToRealTime, result;

    beforeEach(inject(function (_sendStackTraceToRealTime_) {
      sendStackTraceToRealTime = _sendStackTraceToRealTime_;

      exception = {
        cause: 'cause',
        message: 'message',
        stack: 'stack',
        url: 'url'
      };

      result = sendStackTraceToRealTime(exception);
    }));

    it('should send the request', function () {
      expect(socketStream).toHaveBeenCalledOnceWith('/srcmap-reverse', {
        method: 'post',
        cause: exception.cause,
        message: exception.message,
        stack: exception.stack,
        url: exception.url
      }, true);
    });

    it('should return a stream', function () {
      expect(highland.isStream(result)).toBe(true);
    });

    [
      {
        message: 'should',
        response: {
          data: 'formatted exception'
        },
        expected: 'formatted exception'
      },
      {
        message: 'should not',
        response: {
          error: {
            stack: 'internal error'
          }
        },
        expected: 'stack'
      }
    ].forEach(function testProcessResponse (data) {
      describe('and process response', function () {
        it(data.message + ' set the exception.stack to response.data', function () {
          reverseStream.write(data.response);
          reverseStream.end();

          result.each(function verifyResolvedStackTrace (updatedException) {
            expect(updatedException.stack).toEqual(data.expected);
          });
        });
      });
    });
  });
});

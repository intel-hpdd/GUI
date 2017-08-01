import _ from '@iml/lodash-mixins';
import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

fdescribe('Exception modal controller', () => {
  let $scope,
    createController,
    getMessage,
    plainError,
    responseError,
    stackTraceContainsLineNumber,
    sendStackTraceToSrcmapReverseService,
    s,
    reverseStream,
    mod;

  beforeEach(() => {
    reverseStream = Promise.resolve();
    window.fetch = jest.fn(() => reverseStream);

    mod = require('../../../../source/iml/exception/exception-modal-controller.js');
  });

  beforeEach(
    angular.mock.inject(($rootScope, $controller) => {
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
          method: 'POST',
          url: '/api/foo/bar/',
          headers: {},
          data: {}
        }
      };

      stackTraceContainsLineNumber = jest.fn(() => true);

      s = highland();
      sendStackTraceToSrcmapReverseService = jest.fn(() => s);

      createController = deps => {
        deps = _.extend(
          {
            $scope: $scope,
            sendStackTraceToSrcmapReverseService: sendStackTraceToSrcmapReverseService,
            stackTraceContainsLineNumber: stackTraceContainsLineNumber
          },
          deps
        );

        $controller(mod.ExceptionModalCtrl, deps);
      };

      getMessage = name => {
        return $scope.exceptionModal.messages
          .filter(message => {
            return message.name === name;
          })
          .pop();
      };
    })
  );

  it('should convert a string cause to a message', () => {
    plainError.cause = 'fooz';

    createController({
      exception: plainError
    });

    expect(getMessage('cause')).toEqual({ name: 'cause', value: 'fooz' });
  });

  it('should return the expected messages for a plain error', () => {
    //Patch the stack as it becomes inconsistent as it's moved around.
    plainError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({ cause: null, exception: plainError });

    expect($scope.exceptionModal.messages).toEqual([
      { name: 'name', value: 'Error' },
      { name: 'message', value: 'Error' },
      { name: 'Client Stack Trace', value: 'ERROOR!' }
    ]);
  });

  it('should return the expected messages for a response error', () => {
    //Patch the stack as it becomes inconsistent as it's moved around.
    responseError.stack = 'ERROOR!';

    // Note this does not take IE into account as we (currently) do not run automated tests there.
    createController({ cause: null, exception: responseError });

    expect($scope.exceptionModal.messages).toEqual([
      { name: 'name', value: 'Error' },
      { name: 'message', value: 'Response Error' },
      { name: 'Client Stack Trace', value: 'ERROOR!' },
      { name: 'Response Status', value: 500 },
      { name: 'Response Headers', value: '{}' },
      { name: 'method', value: 'POST' },
      { name: 'url', value: '/api/foo/bar/' },
      { name: 'Request Headers', value: '{}' },
      { name: 'data', value: '{}' }
    ]);
  });

  it('should not throw when handling a plain error', () => {
    expect(() => {
      createController({ cause: null, exception: plainError });
    }).not.toThrow();
  });

  describe('handling non-strings when expecting multiline', () => {
    let create;

    beforeEach(() => {
      responseError.stack = 5;

      create = () => {
        createController({ cause: null, exception: responseError });
      };
    });

    it('should handle non-strings when expecting a multiline one', () => {
      expect(create).not.toThrow();
    });

    it('should print the string representation of the value', () => {
      create();

      expect(getMessage('Client Stack Trace')).toEqual({
        name: 'Client Stack Trace',
        value: '5'
      });
    });
  });

  describe('circular references', () => {
    beforeEach(() => {
      responseError.response.config.data.foo = responseError.response;
    });

    it('should not throw when handling a circular reference', () => {
      expect(() => {
        createController({ cause: null, exception: responseError });
      }).not.toThrow();
    });

    it('should return the string representation of the cyclic structure', () => {
      createController({ cause: null, exception: responseError });

      expect(getMessage('data')).toEqual({
        name: 'data',
        value: '[object Object]'
      });
    });
  });

  describe('stack trace format from server', () => {
    beforeEach(() => {
      plainError.statusCode = '400';

      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    it('should add the status code to the output', () => {
      expect(getMessage('Status Code')).toEqual({
        name: 'Status Code',
        value: '400'
      });
    });

    it('should not call sendStackTraceToSrcmapReverseService', () => {
      expect(sendStackTraceToSrcmapReverseService).not.toHaveBeenCalled();
    });

    it('should have a loadingStack value of undefined', () => {
      expect($scope.exceptionModal.loadingStack).toEqual(undefined);
    });
  });

  describe('stack trace format in production mode', () => {
    beforeEach(() => {
      createController({
        cause: 'fooz',
        exception: plainError
      });
    });

    describe('before resolving', () => {
      it('should call stackTraceContainsLineNumber', () => {
        expect(stackTraceContainsLineNumber).toHaveBeenCalled();
      });

      it('should call sendStackTraceToSrcmapReverseService', () => {
        expect(sendStackTraceToSrcmapReverseService).toHaveBeenCalled();
      });

      it('should have a loadingStack value of true', () => {
        expect($scope.exceptionModal.loadingStack).toEqual(true);
      });
    });

    describe('after de-uglifying', () => {
      const formattedStackTrace = 'formattedStackTrace';

      beforeEach(() => {
        s.write({ stack: formattedStackTrace });
        s.end();
      });

      it('should have a loadingStack value of false', () => {
        expect($scope.exceptionModal.loadingStack).toEqual(false);
      });

      it('should have the formatted stack trace', () => {
        expect(
          _.find($scope.exceptionModal.messages, {
            name: 'Client Stack Trace'
          }).value
        ).toEqual(formattedStackTrace);
      });
    });
  });

  describe('stack trace contains line number factory', () => {
    let stackTraceContainsLineNumberFactory;
    beforeEach(() => {
      stackTraceContainsLineNumberFactory = mod.stackTraceContainsLineNumbers;
    });

    [
      { stack: 'at some-file-location/file.js:85:13' },
      { stack: 'some-file-location/file.js:85:13)' },
      { stack: 'at some-file-location/file.js:85:13 ' },
      { stack: 'at some-file-location/file.js:85:13adsf' },
      { stack: 'some-file-location/file.js:85:13 more text' }
    ].forEach(stack => {
      describe('contains line number', () => {
        it(
          'should indicate that ' +
            stack.stack +
            ' contains line numbers and columns',
          () => {
            expect(stackTraceContainsLineNumberFactory(stack)).toEqual(true);
          }
        );
      });
    });

    [
      { stack: 'at some-file-location/file.js:85' },
      { stack: 'at some-file-location/file.js:85:' },
      { stack: 'at some-file-location/file.js:8513' }
    ].forEach(stack => {
      describe('does not contain line number', () => {
        it(
          'should indicate that ' +
            stack.stack +
            " doesn't contain both line and column numbers",
          () => {
            expect(stackTraceContainsLineNumberFactory(stack)).toEqual(false);
          }
        );
      });
    });
  });

  describe('send stack trace to srcmap-reverse service', () => {
    let exception, sendStackTraceToSrcmapReverseService, result;

    beforeEach(() => {
      sendStackTraceToSrcmapReverseService =
        mod.sendStackTraceToSrcmapReverseService;

      exception = {
        cause: 'cause',
        message: 'message',
        stack: 'stack',
        url: 'url'
      };

      result = sendStackTraceToSrcmapReverseService(exception);
    });

    it('should send the request', () => {
      expect(window.fetch).toHaveBeenCalledOnceWith('/iml-srcmap-reverse', {
        method: 'POST',
        headers: {
          Connection: 'close',
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'Transfer-Encoding': 'chunked'
        },
        body: JSON.stringify({
          trace: exception.stack
        })
      });
    });

    it('should return a stream', () => {
      expect(highland.isStream(result)).toBe(true);
    });
  });
});

describe('and process response', () => {
  let responsePromise,
    jsonPromise,
    exception,
    sendStackTraceToSrcmapReverseService,
    result;

  beforeEach(() => {
    exception = {
      cause: 'cause',
      message: 'message',
      stack: 'stack',
      url: 'url'
    };
  });

  it('should set the exception.stack to the response', () => {
    jsonPromise = Promise.resolve('formatted exception');
    responsePromise = Promise.resolve({ json: jest.fn(() => jsonPromise) });
    window.fetch = jest.fn(() => responsePromise);

    ({
      sendStackTraceToSrcmapReverseService
    } = require('../../../../source/iml/exception/exception-modal-controller.js'));

    result = sendStackTraceToSrcmapReverseService(exception);

    result.each(updatedException => {
      expect(updatedException.stack).toEqual('formatted exception');
    });
  });
});

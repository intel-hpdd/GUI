import angular from 'angular';
import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('get the command stream', function () {
  var socketStream, stream, getCommandStream, getCommandStreamModule,
    commandList, result;

  beforeEachAsync(async function () {
    stream = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);
    getCommandStreamModule = await mock('source/iml/command/get-command-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getCommandStream = getCommandStreamModule.default;

    commandList = wrap({}, {}).objects;
    result = getCommandStream(commandList);
  });

  afterEach(resetAll);

  it('should invoke socketStream', function () {
    expect(socketStream).toHaveBeenCalledOnceWith('/command', {
      qs: {
        id__in: [1, 2]
      }
    });
  });

  it('should return a stream', function () {
    expect(highland.isStream(result)).toBe(true);
  });

  it('should write passed data to the stream', function () {
    result.each(function (x) {
      expect(x).toEqual([
        {
          id: 1,
          logs: '',
          jobs: []
        },
        {
          id: 2,
          logs: '',
          jobs: []
        }
      ]);
    });
  });

  function wrap () {
    var commands = [].slice.call(arguments);

    return {
      objects: commands.map(function (command, index) {
        return angular.extend({
          id: index + 1,
          logs: '',
          jobs: []
        }, command);
      })
    };
  }
});

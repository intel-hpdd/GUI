import angular from 'angular';
const {module, inject} = angular.mock;

describe('get the command stream', function () {
  var socketStream, stream, getCommandStream, commandList, result;

  beforeEach(module('command', function ($provide) {
    stream = highland();
    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);
    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject(function (_getCommandStream_) {
    getCommandStream = _getCommandStream_;
    commandList = wrap({}, {}).objects;

    result = getCommandStream(commandList);
  }));

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

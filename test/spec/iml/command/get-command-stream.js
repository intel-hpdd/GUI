describe('get the command stream', function () {
  'use strict';

  var socketStream, stream, getCommandStream, commandList, result;

  beforeEach(module('command', function ($provide) {
    stream = highland();
    socketStream = jasmine.createSpy('socketStream').andReturn(stream);
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
    var proto = Object.getPrototypeOf(highland());

    expect(Object.getPrototypeOf(result)).toBe(proto);
  });

  it('should write passed data to the stream', function () {
    result.each(function (x) {
      expect(x).toEqual([
        {
          id: 1,
          logs: '',
          jobs: [],
          state: 'pending',
          jobIds: []
        },
        {
          id: 2,
          logs: '',
          jobs: [],
          state: 'pending',
          jobIds: []
        }
      ]);
    });
  });

  var states = {
    cancelled: { cancelled: true },
    failed: { errored: true },
    succeeded: { complete: true },
    pending: {
      cancelled: false,
      failed: false,
      complete: false
    }
  };

  Object.keys(states).forEach(function testState (state) {
    it('should be in state ' + state, function () {
      stream.write(wrap(states[state]));

      result.pull(_.noop);

      result.each(function (x) {
        var expected = _.extend({
          state: state,
          jobIds: []
        }, states[state]);

        expect(x).toEqual(wrap(expected).objects);
      });
    });
  });

  it('should trim logs', function () {
    stream.write(wrap({
      logs: '    '
    }));

    result.pull(_.noop);

    result.each(function (x) {
      expect(x[0].logs).toEqual('');
    });
  });

  it('should extract job ids', function () {
    stream.write(wrap({
      jobs: [
        '/api/job/24/',
        '/api/job/25/'
      ]
    }));

    result.pull(_.noop);

    result.each(function (x) {
      expect(x[0].jobIds).toEqual(['24', '25']);
    });
  });

  /**
   * Returns a default command object for testing.
   * Can be extended.
   * @returns {{objects: Array}}
   */
  function wrap () {
    var commands = [].slice.call(arguments, 0);

    return {
      objects: commands.map(function (command, index) {
        return _.extend({
          id: index + 1,
          logs: '',
          jobs: []
        }, command);
      })
    };
  }
});

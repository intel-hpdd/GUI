describe('get copytool stream', function () {
  'use strict';

  var socketStream, stream, configs;

  beforeEach(module(function () {
    configs = angular.module('hsm')._configBlocks;
    angular.module('hsm')._configBlocks = [];
  }, 'hsm'));

  afterEach(function () {
    angular.module('hsm')._configBlocks = configs;
  });

  beforeEach(module(function ($provide) {
    stream = highland();

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(stream);
    $provide.value('socketStream', socketStream);
  }));

  var getCopytoolStream;

  beforeEach(inject(function (_getCopytoolStream_) {
    getCopytoolStream = _getCopytoolStream_;
  }));

  it('should get a stream', function () {
    getCopytoolStream();

    expect(socketStream)
      .toHaveBeenCalledOnceWith('/copytool', {
        qs: {
          limit: 0
        },
        jsonMask: 'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
      });
  });

  it('should set status to state if not started', function () {
    getCopytoolStream()
      .each(expectToEqual([{
        state: 'finished',
        status: 'finished'
      }]));

    stream.write({
      objects: [
        {
          state: 'finished'
        }
      ]
    });
  });

  it('should set status to idle if no active operations', function () {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 0,
        state: 'started',
        status: 'idle'
      }]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 0
        }
      ]
    });
  });

  it('should set status to working', function () {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 1,
        state: 'started',
        status: 'working'
      }]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 1
        }
      ]
    });
  });
});

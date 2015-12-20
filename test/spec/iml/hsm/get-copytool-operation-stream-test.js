import angular from 'angular';
const {module, inject} = angular.mock;

describe('get copytool operation stream', function () {
  'use strict';

  var socketStream, stream;

  beforeEach(module('hsm', function ($provide) {
    stream = highland();

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(stream);

    $provide.value('socketStream', socketStream);
  }));

  var getCopytoolOperationStream;

  beforeEach(inject(function (_getCopytoolOperationStream_) {
    getCopytoolOperationStream = _getCopytoolOperationStream_;
  }));

  it('should get a stream', function () {
    getCopytoolOperationStream();

    expect(socketStream)
      .toHaveBeenCalledOnceWith('/copytool_operation', {
        jsonMask: 'objects(id,copytool/host/label,processed_bytes,total_bytes,\
updated_at,started_at,throughput,type,state,path,description)',
        qs: {
          active: true,
          limit: 0
        }
      });
  });

  describe('computed values', function () {
    var result;

    beforeEach(function () {
      var date = new Date();
      var data = {
        objects: [{
          processed_bytes: 12345,
          total_bytes: 67890,
          started_at: date.toISOString(),
          updated_at: new Date(date.getTime() + 10000).toISOString()
        }]
      };

      result = getCopytoolOperationStream();
      stream.write(data);
    });

    it('should add a progress property', function () {
      result.through(expectStreamToContainItem({ progress: 18.18382677861246 }));
    });

    it('should add a throughput property ', function () {
      result.through(expectStreamToContainItem({ throughput: 1234.5 }));
    });
  });

  describe('handling bad inputs', function () {
    var result;

    beforeEach(function () {
      result = getCopytoolOperationStream();
    });

    it('should return 0 when computed progress is NaN', function () {
      stream.write({
        objects: [
          {
            processed_bytes: 'quack',
            total_bytes: 100
          }
        ]
      });

      result.through(expectStreamToContainItem({ progress: 0 }));
    });

    it('should return 0 for throughput when elapsed time is NaN', function () {
      stream.write({
        objects: [{}]
      });

      result.through(expectStreamToContainItem({ throughput: 0 }));
    });

    it('should return 0 for throughput when elapsed time is < 1 second', function () {
      var date = new Date().toISOString();
      stream.write({
        objects: [
          {
            started_at: date,
            updated_at: date
          }
        ]
      });
      result.through(expectStreamToContainItem({ throughput: 0 }));
    });

    it('should return 0 when computed throughput is NaN', function () {
      var date = new Date();
      stream.write({
        objects: [
          {
            started_at: date.toISOString(),
            updated_at: new Date(date.getTime() + 1000).toISOString(),
            processed_bytes: 'quack'
          }
        ]
      });
      result.through(expectStreamToContainItem({ throughput: 0 }));
    });
  });
});

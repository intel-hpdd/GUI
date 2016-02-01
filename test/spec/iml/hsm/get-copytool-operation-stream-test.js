import λ from 'highland';
import hsmModule from '../../../../source/iml/hsm/hsm-module';

describe('get copytool operation stream', () => {
  var socketStream, stream;

  beforeEach(module(hsmModule, ($provide) => {
    stream = λ();
    spyOn(stream, 'destroy');

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(stream);

    $provide.value('socketStream', socketStream);
  }));

  var getCopytoolOperationStream;

  beforeEach(inject((_getCopytoolOperationStream_) => {
    getCopytoolOperationStream = _getCopytoolOperationStream_;
  }));

  it('should get a stream', () => {
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

  it('should destroy the source stream', () => {
    const s = getCopytoolOperationStream();
    s.destroy();

    expect(stream.destroy)
      .toHaveBeenCalledOnce();
  });

  describe('computed values', () => {
    var result;

    beforeEach(() => {
      var date = new Date();
      var data = {
        objects: [{
          processed_bytes: 12345,
          total_bytes: 67890,
          started_at: date.toISOString(),
          updated_at: new Date(date.getTime() + 10000).toISOString()
        }
        ]
      };

      result = getCopytoolOperationStream();
      stream.write(data);
    });

    it('should add a progress property', () => {
      result.through(expectStreamToContainItem({ progress: 18.18382677861246 }));
    });

    it('should add a throughput property ', () => {
      result.through(expectStreamToContainItem({ throughput: 1234.5 }));
    });
  });

  describe('handling bad inputs', () => {
    var result;

    beforeEach(() => {
      result = getCopytoolOperationStream();
    });

    it('should return 0 when computed progress is NaN', () => {
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

    it('should return 0 for throughput when elapsed time is NaN', () => {
      stream.write({
        objects: [{}]
      });

      result.through(expectStreamToContainItem({ throughput: 0 }));
    });

    it('should return 0 for throughput when elapsed time is < 1 second', () => {
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

    it('should return 0 when computed throughput is NaN', () => {
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

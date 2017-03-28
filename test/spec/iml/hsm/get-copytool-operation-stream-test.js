import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('get copytool operation stream', () => {
  let socketStream, stream, getCopytoolOperationStream;

  beforeEachAsync(async function() {
    stream = highland();
    spyOn(stream, 'destroy');

    socketStream = jasmine.createSpy('socketStream').and.returnValue(stream);

    const mod = await mock('source/iml/hsm/get-copytool-operation-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getCopytoolOperationStream = mod.default;
  });

  afterEach(resetAll);

  it('should get a stream', () => {
    getCopytoolOperationStream();

    expect(socketStream).toHaveBeenCalledOnceWith('/copytool_operation', {
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

    expect(stream.destroy).toHaveBeenCalledOnce();
  });

  describe('computed values', () => {
    let result;

    beforeEach(() => {
      const date = new Date();
      const data = {
        objects: [
          {
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
      result.through(
        expectStreamToContainItem({ progress: 18.18382677861246 })
      );
    });

    it('should add a throughput property ', () => {
      result.through(expectStreamToContainItem({ throughput: 1234.5 }));
    });
  });

  describe('handling bad inputs', () => {
    let result;

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
      const date = new Date().toISOString();
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
      const date = new Date();
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

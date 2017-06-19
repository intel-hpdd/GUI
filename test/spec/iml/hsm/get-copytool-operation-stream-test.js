import highland from 'highland';
import { streamToPromise } from '../../../../source/iml/promise-transforms.js';

describe('get copytool operation stream', () => {
  let mockSocketStream, stream, getCopytoolOperationStream;

  beforeEach(() => {
    stream = highland();
    jest.spyOn(stream, 'destroy');

    mockSocketStream = jest.fn(() => stream);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    const mod = require('../../../../source/iml/hsm/get-copytool-operation-stream.js');

    getCopytoolOperationStream = mod.default;
  });

  it('should get a stream', () => {
    getCopytoolOperationStream();

    expect(mockSocketStream).toHaveBeenCalledOnceWith('/copytool_operation', {
      jsonMask:
        'objects(id,copytool/host/label,processed_bytes,total_bytes,\
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

    expect(stream.destroy).toHaveBeenCalledTimes(1);
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

    it('should add a progress property', async () => {
      expect((await streamToPromise(result))[0]).toContainItems({
        progress: 18.18382677861246
      });
    });

    it('should add a throughput property ', async () => {
      expect((await streamToPromise(result))[0]).toContainItems({
        throughput: 1234.5
      });
    });
  });

  describe('handling bad inputs', () => {
    let result;

    beforeEach(() => {
      result = getCopytoolOperationStream();
    });

    it('should return 0 when computed progress is NaN', async () => {
      stream.write({
        objects: [
          {
            processed_bytes: 'quack',
            total_bytes: 100
          }
        ]
      });

      expect((await streamToPromise(result))[0]).toContainItems({
        progress: 0
      });
    });

    it('should return 0 for throughput when elapsed time is NaN', async () => {
      stream.write({
        objects: [{}]
      });

      expect((await streamToPromise(result))[0]).toContainItems({
        throughput: 0
      });
    });

    it('should return 0 for throughput when elapsed time is < 1 second', async () => {
      const date = new Date().toISOString();
      stream.write({
        objects: [
          {
            started_at: date,
            updated_at: date
          }
        ]
      });

      expect((await streamToPromise(result))[0]).toContainItems({
        throughput: 0
      });
    });

    it('should return 0 when computed throughput is NaN', async () => {
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

      expect((await streamToPromise(result))[0]).toContainItems({
        throughput: 0
      });
    });
  });
});

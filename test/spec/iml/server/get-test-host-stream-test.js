import getTestHostStream
  from '../../../../source/iml/server/get-test-host-stream.js';
import highland from 'highland';

describe('get test host stream', () => {
  let testHostStream, spring, stream, data;
  beforeEach(() => {
    stream = highland();
    spring = jest.fn(() => stream);
    data = [
      {
        address: 'lotus-34vm5.iml.intel.com',
        status: [
          { name: 'auth', value: true },
          { name: 'reverse_ping', value: false }
        ]
      }
    ];
    testHostStream = getTestHostStream()(spring, {
      objects: [{ address: 'address1' }]
    });
  });

  it('should be a function', () => {
    expect(getTestHostStream).toEqual(expect.any(Function));
  });
  it('should return a stream', () => {
    const proto = Object.getPrototypeOf(highland());
    expect(Object.getPrototypeOf(testHostStream)).toBe(proto);
  });
  it('should post to test_host', () => {
    expect(spring).toHaveBeenCalledOnceWith('testHost', '/test_host', {
      method: 'post',
      json: { objects: [{ address: 'address1' }] }
    });
  });
  describe('invoking the pipe', () => {
    beforeEach(() => {
      stream.write(data);
    });
    it('should indicate that the response is invalid', () => {
      testHostStream.each(resp => {
        expect(resp.valid).toEqual(false);
      });
    });
    it('should have an updated response value', () => {
      testHostStream.each(resp => {
        expect(resp).toEqual({
          objects: [
            {
              address: 'lotus-34vm5.iml.intel.com',
              status: [
                { name: 'auth', value: true, uiName: 'Auth' },
                { name: 'reverse_ping', value: false, uiName: 'Reverse ping' }
              ]
            }
          ],
          valid: false
        });
      });
    });
  });
});

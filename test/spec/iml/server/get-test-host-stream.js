describe('get test host stream', function () {
  'use strict';

  beforeEach(module('server'));

  var getTestHostStream, testHostStream, spring, stream, data;

  beforeEach(inject(function (λ, _getTestHostStream_) {
    stream = λ();
    spring = jasmine.createSpy('spring').andReturn(stream);

    data = [
      {
        address: 'lotus-34vm5.iml.intel.com',
        status: [
          {
            name: 'auth',
            value: true
          },
          {
            name: 'reverse_ping',
            value: false
          }
        ]
      }
    ];

    getTestHostStream = _getTestHostStream_;
    testHostStream = getTestHostStream(spring, {
      objects: [ { address: 'address1' } ]
    });
  }));

  it('should be a function', function () {
    expect(getTestHostStream).toEqual(jasmine.any(Function));
  });

  it('should return a stream', function () {
    var proto = Object.getPrototypeOf(highland());

    expect(Object.getPrototypeOf(testHostStream)).toBe(proto);
  });

  it('should post to test_host', function () {
    expect(spring).toHaveBeenCalledOnceWith('testHost', '/test_host', {
      method: 'post',
      json: {
        objects: [ { address: 'address1' } ]
      }
    });
  });

  describe('invoking the pipe', function () {
    beforeEach(function () {
      stream.write(data);
    });

    it('should indicate that the response is invalid', function () {
      testHostStream.each(function (resp) {
        expect(resp.valid).toEqual(false);
      });
    });

    it('should have an updated response value', function () {
      testHostStream.each(function (resp) {
        expect(resp).toEqual({
          objects: [
            {
              address: 'lotus-34vm5.iml.intel.com',
              status: [
                {
                  name: 'auth',
                  value: true,
                  uiName: 'Auth'
                },
                {
                  name: 'reverse_ping',
                  value: false,
                  uiName: 'Reverse ping'
                }
              ]
            }
          ],
          valid: false
        });
      });
    });
  });
});

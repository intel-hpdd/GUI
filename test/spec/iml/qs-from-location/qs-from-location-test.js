import mod from '../../../../source/iml/qs-from-location/qs-from-location.js';

describe('qs from location', () => {
  let qsFromLocation, format;

  beforeEach(() => {
    format = jasmine.createSpy('format');
    const state = {
      router: {
        urlMatcherFactory: {
          paramTypes: 'paramTypes',
          UrlMatcher: jasmine.createSpy('UrlMatcher').and.returnValue({
            format: format
          })
        }
      },
      transition: {
        to: jasmine.createSpy('to').and.returnValue({
          url: '/status?severity&record_type'
        })
      }
    };

    qsFromLocation = mod(state);
  });

  it('should be a function', function() {
    expect(qsFromLocation).toEqual(jasmine.any(Function));
  });

  describe('with valid params', () => {
    let result;
    beforeEach(() => {
      format.and.returnValue('/status?severity=info&record_type=active');

      result = qsFromLocation({ severity: 'info', record_type: 'active' });
    });

    it('should return the qs', function() {
      expect(result).toEqual('severity=info&record_type=active');
    });
  });

  it('should return an empty string for no qs', function() {
    format.and.returnValue('/status');

    expect(qsFromLocation({})).toEqual('');
  });
});

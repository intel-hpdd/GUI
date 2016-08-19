import qsFromLocationModule from '../../../../source/iml/qs-from-location/qs-from-location-module';

describe('qs from location', () => {
  let qsFromLocation;

  beforeEach(module(qsFromLocationModule, $provide => {
    let state = {
      router: {
        urlMatcherFactory: {
          UrlMatcher: jasmine.createSpy('UrlMatcher')
          .and.returnValue({
            format: jasmine.createSpy('format')
              .and.callFake(params => {
                return Object.keys(params)
                  .reduce((str, key) => {
                    if (params[key] != null) {
                      str = (str === '/status?') ? str : str + '&';
                      str += key + '=' + params[key];
                    }
                    return str;
                  }, '/status?');
              })
          })
        }
      },
      transition: {
        to: jasmine.createSpy('to')
          .and.returnValue({
            url: '/status?severity__in&severity__contains&severity__startswith&severity__endswith&severity__gte&severity__gt&severity__lte&severity__lt&record_type__in&record_type__contains&record_type__startswith&record_type__endswith&record_type__gte&record_type__gt&record_type__lte&record_type__lt&active__in&active__contains&active__startswith&active__endswith&active__gte&active__gt&active__lte&active__lt&offset__in&offset__contains&offset__startswith&offset__endswith&offset__gte&offset__gt&offset__lte&offset__lt&limit__in&limit__contains&limit__startswith&limit__endswith&limit__gte&limit__gt&limit__lte&limit__lt&order_by__in&order_by__contains&order_by__startswith&order_by__endswith&order_by__gte&order_by__gt&order_by__lte&order_by__lt&begin__in&begin__contains&begin__startswith&begin__endswith&begin__gte&begin__gt&begin__lte&begin__lt&end__in&end__contains&end__startswith&end__endswith&end__gte&end__gt&end__lte&end__lt&severity&record_type&active&offset&limit&order_by&begin&end'
          })
      }
    };

    $provide.value('$state', state);
  }));

  beforeEach(inject(_qsFromLocation_ => {
    qsFromLocation = _qsFromLocation_;
  }));

  it('should be a function', function () {
    expect(qsFromLocation).toEqual(jasmine.any(Function));
  });


  it('should return the qs for valid params', function () {
    expect(qsFromLocation({severity: 'info', record_type: 'active', invalid_param: undefined})).toEqual('severity=info&record_type=active');
  });

  it('should return an empty string for no qs', function () {
    expect(qsFromLocation({})).toEqual('');
  });
});

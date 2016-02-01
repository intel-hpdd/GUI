import qsFromLocationModule from '../../../../source/iml/qs-from-location/qs-from-location-module';


describe('qs from location', function () {
  var $location;

  beforeEach(module(qsFromLocationModule, $provide => {
    $location = {
      absUrl: jasmine.createSpy('absUrl')
    };
    $provide.value('$location', $location);
  }));

  var qsFromLocation;

  beforeEach(inject(function (_qsFromLocation_) {
    qsFromLocation = _qsFromLocation_;
  }));

  it('should be a function', function () {
    expect(qsFromLocation).toEqual(jasmine.any(Function));
  });

  it('should return the current qs', function () {
    $location.absUrl
      .and.returnValue('http://example.com/#/some/path?foo=bar&baz=xoxo');

    expect(qsFromLocation()).toEqual('foo=bar&baz=xoxo');
  });

  it('should return an empty string for no qs', function () {
    $location.absUrl
      .and.returnValue('http://example.com/#/some/path');

    expect(qsFromLocation()).toEqual('');
  });
});

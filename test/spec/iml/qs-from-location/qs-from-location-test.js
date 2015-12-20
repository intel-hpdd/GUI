import angular from 'angular';
const {module, inject} = angular.mock;

describe('qs from location', function () {
  var $location;

  beforeEach(module('qsFromLocation', function ($provide) {
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
      .andReturn('http://example.com/#/some/path?foo=bar&baz=xoxo');

    expect(qsFromLocation()).toEqual('foo=bar&baz=xoxo');
  });

  it('should return an empty string for no qs', function () {
    $location.absUrl
      .andReturn('http://example.com/#/some/path');

    expect(qsFromLocation()).toEqual('');
  });
});

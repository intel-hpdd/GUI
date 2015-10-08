describe('get template promise', function () {
  'use strict';

  beforeEach(module('get-template-promise'));

  var getTemplatePromise, $httpBackend, $templateCache, $rootScope, spy;

  beforeEach(inject(function (_getTemplatePromise_, _$httpBackend_, _$templateCache_, _$rootScope_) {
    getTemplatePromise = _getTemplatePromise_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;
    $rootScope = _$rootScope_;

    spy = jasmine.createSpy('spy');

    getTemplatePromise('/foo/bar')
      .then(spy);
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch a given template', function () {
    $httpBackend.expectGET('/foo/bar').respond('foo');

    $httpBackend.flush();

    expect(spy).toHaveBeenCalledOnceWith('foo');
  });

  it('should serve from template cache if available', function () {
    $templateCache.put('/foo/bar', 'bar');

    $rootScope.$digest();

    expect(spy).toHaveBeenCalledOnceWith('bar');
  });
});

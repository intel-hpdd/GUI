import angular from 'angular';
const {module, inject} = angular.mock;

import StatusQueryController from
  '../../../../source/chroma_ui/iml/status/status-query-controller-exports';

describe('status query controller', function () {
  beforeEach(module('status'));

  var ctrl, $scope, $location, routeStream, s,
    inputToQsParser, qsToInputParser;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    $location = {
      search: jasmine.createSpy('search')
    };

    s = highland();
    spyOn(s, 'destroy');
    routeStream = jasmine.createSpy('routeStream').and.returnValue(s);

    ctrl = $controller('StatusQueryController', {
      $scope: $scope,
      $location: $location,
      routeStream: routeStream,
      inputToQsParser: inputToQsParser,
      qsToInputParser: qsToInputParser
    });
  }));

  it('should set the controller properties', function () {
    const instance = window.extendWithConstructor(StatusQueryController, {
      parserFormatter: {
        parser: inputToQsParser,
        formatter: qsToInputParser
      },
      onSubmit: jasmine.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  it('should set the current qs', function () {
    s.write({
      qs: 'bar=baz'
    });

    expect(ctrl.qs).toBe('bar=baz');
  });

  it('should set the location query string on submit', function () {
    ctrl.onSubmit('foo=bar');

    expect($location.search)
      .toHaveBeenCalledOnceWith('foo=bar');
  });

  it('should destroy the route stream when the scope is destroyed', function () {
    $scope.$destroy();

    expect(s.destroy).toHaveBeenCalledOnce();
  });
});

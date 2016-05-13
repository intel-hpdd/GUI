import highland from 'highland';

import statusModule
  from '../../../../source/iml/status/status-module';
import StatusQueryController
  from '../../../../source/iml/status/status-query-controller';

describe('status query controller', function () {
  beforeEach(module(statusModule));

  var ctrl, $scope, $location, routeStream, s, statusCompleter,
    statusInputToQsParser, statusQsToInputParser;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    $location = {
      search: jasmine.createSpy('search')
    };

    s = highland();
    spyOn(s, 'destroy');
    routeStream = jasmine.createSpy('routeStream').and.returnValue(s);

    statusCompleter = 'completer';

    ctrl = $controller('StatusQueryController', {
      $scope,
      $location,
      routeStream,
      statusCompleter,
      statusInputToQsParser,
      statusQsToInputParser
    });
  }));

  it('should set the controller properties', function () {
    const instance = window.extendWithConstructor(StatusQueryController, {
      parserFormatter: {
        parser: statusInputToQsParser,
        formatter: statusQsToInputParser
      },
      completer: statusCompleter,
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

import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('log query component controller', () => {
  let ctrl, $scope, $location, $stateParams, controller, qsStream, s;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/logs/log-query-component.js', {
      'source/iml/logs/log-input-to-qs-parser.js': { default: 'inputParser' },
      'source/iml/logs/log-qs-to-input-parser.js': { default: 'qsParser' },
      'source/iml/logs/log-completer.js': { default: 'completer' }
    });

    controller = mod.controller;
  });

  afterEach(resetAll);

  beforeEach(module('extendScope'));

  beforeEach(
    inject(($rootScope, $controller, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jasmine.createSpy('search')
      };

      $stateParams = {
        param: 'val'
      };

      s = highland();
      spyOn(s, 'destroy');
      qsStream = jasmine.createSpy('qsStream').and.returnValue(s);

      ctrl = $controller(controller, {
        $scope,
        $location,
        $stateParams,
        qsStream,
        propagateChange
      });
    })
  );

  it('should set the controller properties', () => {
    expect(ctrl).toEqual(
      jasmine.objectContaining({
        parserFormatter: {
          parser: 'inputParser',
          formatter: 'qsParser'
        },
        completer: 'completer',
        onSubmit: jasmine.any(Function)
      })
    );
  });

  it('should call qsStream', () => {
    expect(qsStream).toHaveBeenCalledOnceWith($stateParams);
  });

  it('should set the current qs', () => {
    s.write({
      qs: 'bar=baz'
    });

    expect(ctrl.qs).toBe('bar=baz');
  });

  it('should set the location query string on submit', () => {
    ctrl.onSubmit('foo=bar');

    expect($location.search).toHaveBeenCalledOnceWith('foo=bar');
  });

  it('should destroy the route stream when the scope is destroyed', () => {
    $scope.$destroy();

    expect(s.destroy).toHaveBeenCalledTimes(1);
  });
});

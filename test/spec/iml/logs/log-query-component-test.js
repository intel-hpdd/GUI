import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('log query component controller', () => {
  let ctrl, $scope, $location, $stateParams, controller, qsStream, s;

  beforeEach(() => {
    jest.mock(
      '../../../../source/iml/logs/log-input-to-qs-parser.js',
      () => 'inputParser'
    );
    jest.mock(
      '../../../../source/iml/logs/log-qs-to-input-parser.js',
      () => 'qsParser'
    );
    jest.mock(
      '../../../../source/iml/logs/log-completer.js',
      () => 'completer'
    );

    const mod = require('../../../../source/iml/logs/log-query-component.js');

    controller = mod.controller;
  });

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      $scope = $rootScope.$new();

      $location = {
        search: jest.fn()
      };

      $stateParams = {
        param: 'val'
      };

      s = highland();
      jest.spyOn(s, 'destroy');
      qsStream = jest.fn(() => s);

      ctrl = {};

      controller.bind(ctrl)(
        $scope,
        $location,
        $stateParams,
        qsStream,
        propagateChange
      );
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
        onSubmit: expect.any(Function)
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

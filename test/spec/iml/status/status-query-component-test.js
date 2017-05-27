import highland from 'highland';
import angular from '../../../angular-mock-setup.js';

describe('status query controller', () => {
  let ctrl,
    $location,
    qsStream,
    s,
    mockStatusCompleter,
    $stateParams,
    mockStatusInputToQsParser,
    mockStatusQsToInputParser,
    mod;
  beforeEach(function() {
    $location = { search: jest.fn() };
    s = highland();
    jest.spyOn(s, 'destroy');
    qsStream = jest.fn(() => s);
    $stateParams = { param: 'val' };
    mockStatusCompleter = 'completer';
    mockStatusQsToInputParser = 'statusQsToInputParser';
    mockStatusInputToQsParser = 'statusInputToQsParser';
    jest.mock(
      '../../../../source/iml/status/status-qs-to-input-parser.js',
      () => mockStatusQsToInputParser
    );
    jest.mock(
      '../../../../source/iml/status/status-input-to-qs-parser.js',
      () => mockStatusInputToQsParser
    );
    jest.mock(
      '../../../../source/iml/status/status-completer.js',
      () => mockStatusCompleter
    );

    mod = require('../../../../source/iml/status/status-query-component.js');
  });

  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      const $scope = $rootScope.$new();
      ctrl = new mod.StatusQueryController(
        $scope,
        $location,
        qsStream,
        propagateChange,
        $stateParams
      );
    })
  );
  it('should set the controller properties', () => {
    const instance = jasmine.objectContaining({
      parserFormatter: {
        parser: mockStatusInputToQsParser,
        formatter: mockStatusQsToInputParser
      },
      completer: mockStatusCompleter,
      onSubmit: expect.any(Function)
    });
    expect(ctrl).toEqual(instance);
  });
  it('should call qsStream', () => {
    expect(qsStream).toHaveBeenCalledOnceWith($stateParams);
  });
  it('should set the current qs', () => {
    s.write({ qs: 'bar=baz' });
    expect(ctrl.qs).toBe('bar=baz');
  });
  it('should set the location query string on submit', () => {
    ctrl.onSubmit('foo=bar');
    expect($location.search).toHaveBeenCalledWith('foo=bar');
  });
  it('should destroy the route stream when the scope is destroyed', () => {
    ctrl.$onDestroy();
    expect(s.destroy).toHaveBeenCalledTimes(1);
  });
});

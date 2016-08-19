import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('status query controller', () => {
  let ctrl, $location,
    qsStream, s, statusCompleter, $stateParams,
    statusInputToQsParser, statusQsToInputParser,
    mod;

  beforeEachAsync(async function () {
    $location = {
      search: jasmine.createSpy('search')
    };

    s = highland();
    spyOn(s, 'destroy');

    qsStream = jasmine
      .createSpy('qsStream')
      .and
      .returnValue(s);

    $stateParams = {
      param: 'val'
    };

    statusCompleter = 'completer';
    statusQsToInputParser = 'statusQsToInputParser';
    statusInputToQsParser = 'statusInputToQsParser';

    mod = await mock('source/iml/status/status-query-component.js', {
      'source/iml/status/status-qs-to-input-parser.js': {
        default: statusQsToInputParser
      },
      'source/iml/status/status-input-to-qs-parser.js': {
        default: statusInputToQsParser
      },
      'source/iml/status/status-completer.js': {
        default: statusCompleter
      }
    });
  });

  beforeEach(module('extendScope'));

  beforeEach(inject(($rootScope, propagateChange) => {
    const $scope = $rootScope.$new();
    ctrl = new mod.StatusQueryController($scope, $location, qsStream, propagateChange, $stateParams);
  }));

  afterEach(resetAll);

  it('should set the controller properties', () => {
    const instance = jasmine.objectContaining({
      parserFormatter: {
        parser: statusInputToQsParser,
        formatter: statusQsToInputParser
      },
      completer: statusCompleter,
      onSubmit: jasmine.any(Function)
    });

    expect(ctrl)
      .toEqual(instance);
  });

  it('should call qsStream', () => {
    expect(qsStream).toHaveBeenCalledOnceWith($stateParams);
  });

  it('should set the current qs', () => {
    s.write({
      qs: 'bar=baz'
    });

    expect(ctrl.qs)
      .toBe('bar=baz');
  });

  it('should set the location query string on submit', () => {
    ctrl
      .onSubmit('foo=bar');

    expect($location.search)
      .toHaveBeenCalledWith('foo=bar');
  });

  it('should destroy the route stream when the scope is destroyed', () => {
    ctrl.$onDestroy();

    expect(s.destroy)
      .toHaveBeenCalledOnce();
  });
});

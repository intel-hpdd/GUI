import highland from 'highland';
import corosyncModule from '../../../../source/iml/corosync/corosync-module';

describe('corosync state directive', () => {
  beforeEach(module(corosyncModule));

  var el, $scope, $compile;

  beforeEach(inject(($rootScope, _$compile_) => {
    $compile = _$compile_;

    var template = '<corosync-state stream="stream"></corosync-state>';

    $scope = $rootScope.$new();
    $scope.stream = highland();
    spyOn($scope.stream, 'destroy');

    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  var states = [
    ['Corosync Started', 'started'],
    ['Corosync Stopped', 'stopped'],
    ['Unconfigured', 'unconfigured']
  ];

  states.forEach(state => {
    it('should display state for ' + state[0] + ' with no host id', () => {
      $scope.stream.write({
        state: state[1]
      });

      expect(el.querySelector('span span').textContent.trim())
        .toEqual(state[0]);
    });
  });

  it('should display nothing when there is no data', () => {
    $scope.stream.write([]);

    expect(el.querySelector('span span'))
      .toBeNull();
  });

  it('should destroy the stream when the scope is destroyed', () => {
    $scope.$destroy();

    expect($scope.stream.destroy).toHaveBeenCalledOnce();
  });
});

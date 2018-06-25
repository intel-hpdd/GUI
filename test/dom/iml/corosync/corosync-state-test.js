import highland from 'highland';
import angular from '../../../angular-mock-setup.js';
import corosyncState from '../../../../source/iml/corosync/corosync-state.js';

describe('corosync state directive', () => {
  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component('corosyncState', corosyncState);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = '<corosync-state stream="stream"></corosync-state>';

      $scope = $rootScope.$new();
      $scope.stream = highland();
      jest.spyOn($scope.stream, 'destroy');

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  const states = [['Corosync Started', 'started'], ['Corosync Stopped', 'stopped'], ['Unconfigured', 'unconfigured']];

  states.forEach(state => {
    it(`should display state for ${state[0]} with no host id`, () => {
      $scope.stream.write({
        state: state[1]
      });

      expect(el.querySelector('span').textContent.trim()).toEqual(state[0]);
    });
  });

  it('should display nothing when there is no data', () => {
    $scope.stream.write();

    expect(el.querySelector('span')).toBeNull();
  });

  it('should display nothing when there is bad data', () => {
    $scope.stream.write(null);

    expect(el.querySelector('span')).toBeNull();
  });

  it('should destroy the stream when the scope is destroyed', () => {
    $scope.$destroy();

    expect($scope.stream.destroy).toHaveBeenCalledTimes(1);
  });
});

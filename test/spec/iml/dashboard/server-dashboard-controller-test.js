import highland from 'highland';
import ServerDashboardController from '../../../../source/iml/dashboard/server-dashboard-controller.js';
import angular from '../../../angular-mock-setup.js';

describe('Server dashboard controller', () => {
  let $scope, ctrl, hostStream, charts, chart;
  beforeEach(
    angular.mock.inject($rootScope => {
      $scope = $rootScope.$new();
      chart = { stream: { destroy: jest.fn() } };
      charts = [chart];
      hostStream = highland();
      jest.spyOn(hostStream, 'destroy');
      ctrl = {};
      ServerDashboardController.bind(ctrl)($scope, hostStream, charts);
    })
  );
  it('should add charts to the controller', () => {
    expect(ctrl.charts).toBe(charts);
  });
  it('should set host data on the controller', () => {
    hostStream.write('foo');
    expect(ctrl.server).toEqual('foo');
  });
  it('should destroy the host stream', () => {
    $scope.$destroy();
    expect(hostStream.destroy).toHaveBeenCalledTimes(1);
  });
});

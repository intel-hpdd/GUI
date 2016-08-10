import highland from 'highland';

import serverDashboardModule from '../../../../source/iml/dashboard/server-dashboard-module';

describe('Server dashboard controller', () => {
  beforeEach(module(serverDashboardModule));

  var $scope, ctrl, hostStream, charts, chart;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    chart = {
      stream: {
        destroy: jasmine.createSpy('destroy')
      }
    };
    charts = [chart];

    hostStream = highland();
    spyOn(hostStream, 'destroy');

    ctrl = $controller('ServerDashboardCtrl', {
      $scope,
      hostStream,
      charts
    });
  }));

  it('should add charts to the controller', function () {
    expect(ctrl.charts).toBe(charts);
  });

  it('should set host data on the controller', function () {
    hostStream.write('foo');

    expect(ctrl.server).toEqual('foo');
  });

  it('should destroy the host stream', function () {
    $scope.$destroy();

    expect(hostStream.destroy).toHaveBeenCalledOnce();
  });
});

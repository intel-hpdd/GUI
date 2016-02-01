import highland from 'highland';

import targetDashboardModule
  from '../../../../source/iml/dashboard/target-dashboard-module';
import TargetDashboardController
  from '../../../../source/iml/dashboard/target-dashboard-controller';

describe('target dashboard', () => {
  beforeEach(module(targetDashboardModule));

  var $scope, ctrl, charts, targetStream, usageStream;

  beforeEach(inject(($controller, $rootScope) => {
    $scope = $rootScope.$new();

    charts = [{
      destroy: jasmine.createSpy('destroy')
    }];

    targetStream = highland();
    spyOn(targetStream, 'destroy');

    usageStream = highland();
    spyOn(usageStream, 'destroy');

    ctrl = $controller('TargetDashboardController', {
      $scope: $scope,
      charts: charts,
      kind: 'MDT',
      targetStream: targetStream,
      usageStream: usageStream
    });
  }));

  it('should setup the controller', () => {
    const scope = window.extendWithConstructor(TargetDashboardController, {
      charts: charts,
      usageStream: usageStream,
      kind: 'MDT'
    });

    expect(ctrl).toEqual(scope);
  });

  it('should set data on the controller', () => {
    targetStream.write('foo');

    expect(ctrl.target).toEqual('foo');
  });

  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it('should destroy the target stream', () => {
      expect(targetStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the usage stream', () => {
      expect(usageStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the charts', () => {
      expect(charts[0].destroy)
        .toHaveBeenCalledOnce();
    });
  });
});

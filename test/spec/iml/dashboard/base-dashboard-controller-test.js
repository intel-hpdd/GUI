import highland from 'highland';

import baseDashboardModule from '../../../../source/iml/dashboard/base-dashboard-module';
import BaseDashboardCtrl from '../../../../source/iml/dashboard/base-dashboard-controller';

describe('base dashboard controller', () => {
  beforeEach(module(baseDashboardModule));

  var $scope, fsStream, charts, baseDashboardCtrl, chart;

  beforeEach(inject(($controller, $rootScope, addProperty) => {
    fsStream = highland();
    spyOn(fsStream, 'destroy');

    $scope = $rootScope.$new();
    spyOn($scope, 'localApply');
    spyOn($scope, 'handleException');

    chart = {
      destroy: jasmine.createSpy('destroy')
    };

    charts = [
      Object.create(chart),
      Object.create(chart)
    ];

    baseDashboardCtrl = $controller('BaseDashboardCtrl', {
      $scope: $scope,
      fsStream: fsStream.through(addProperty),
      charts: charts
    });
  }));

  it('should setup the controller', () => {
    const scope = window.extendWithConstructor(BaseDashboardCtrl, {
      fs: [],
      fsStream: jasmine.any(Object),
      charts: charts
    });

    expect(baseDashboardCtrl).toEqual(scope);
  });

  describe('streaming data', () => {
    beforeEach(() => {
      fsStream.write({ id: 1 });
    });

    it('should wire up the fs stream', () => {
      expect(baseDashboardCtrl.fs).toEqual({
        id: 1,
        STATES: Object.freeze({
          MONITORED: 'monitored',
          MANAGED: 'managed'
        }),
        state: 'managed'
      });
    });

    it('should locally apply the changes', () => {
      expect($scope.localApply).toHaveBeenCalledOnce();
    });
  });

  it('should call handleException on error', () => {
    var err = {
      __HighlandStreamError__: true,
      error: new Error('boom!')
    };

    fsStream.write(err);

    expect($scope.handleException.calls.mostRecent().args[0])
      .toEqual(new Error('boom!'));
  });

  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it('should destroy the stream', () => {
      expect(fsStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the charts', () => {
      expect(chart.destroy)
        .toHaveBeenCalledTwice();
    });
  });
});
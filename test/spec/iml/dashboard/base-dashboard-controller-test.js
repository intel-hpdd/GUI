describe('base dashboard controller', function () {
  'use strict';

  beforeEach(module('dashboard'));

  var $scope, fsStream, charts, baseDashboardCtrl;

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    fsStream = highland();
    spyOn(fsStream, 'destroy');

    $scope = $rootScope.$new();
    spyOn($scope, 'localApply');
    spyOn($scope, 'handleException');

    charts = [
      'chart1',
      'chart2'
    ];

    baseDashboardCtrl = $controller('BaseDashboardCtrl', {
      $scope: $scope,
      fsStream: fsStream.through(addProperty),
      charts: charts
    });
  }));

  it('should setup the controller', function () {
    expect(baseDashboardCtrl).toEqual({
      fs: [],
      fsStream: jasmine.any(Object),
      charts: charts
    });
  });

  describe('streaming data', function () {
    beforeEach(function () {
      fsStream.write({ id: 1 });
    });

    it('should wire up the fs stream', function () {
      expect(baseDashboardCtrl.fs).toEqual({
        id: 1,
        STATES: Object.freeze({
          MONITORED: 'monitored',
          MANAGED: 'managed'
        }),
        state: 'managed'
      });
    });

    it('should locally apply the changes', function () {
      expect($scope.localApply).toHaveBeenCalledOnce();
    });
  });

  it('should call handleException on error', function () {
    var err = {
      __HighlandStreamError__: true,
      error: new Error('boom!')
    };

    fsStream.write(err);

    expect($scope.handleException.mostRecentCall.args[0])
      .toEqual(new Error('boom!'));
  });

  it('should destroy the stream when the scope is destroyed', function () {
    $scope.$destroy();
    expect(fsStream.destroy).toHaveBeenCalledOnce();
  });
});

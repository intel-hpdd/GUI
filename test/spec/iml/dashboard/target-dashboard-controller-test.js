import angular from 'angular';
const {module, inject} = angular.mock;

describe('target dashboard', function () {
  beforeEach(module('targetDashboard'));

  var $scope, ctrl, charts, targetStream, usageStream;

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    charts = ['foo'];

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

  it('should setup the controller', function () {
    expect(ctrl).toEqual({
      charts: charts,
      usageStream: usageStream,
      kind: 'MDT'
    });
  });

  it('should set data on the controller', function () {
    targetStream.write('foo');

    expect(ctrl.target).toEqual('foo');
  });

  describe('on destroy', function () {
    beforeEach(function () {
      $scope.$destroy();
    });

    it('should destroy the target stream', function () {
      expect(targetStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the usage stream', function () {
      expect(usageStream.destroy).toHaveBeenCalledOnce();
    });
  });
});

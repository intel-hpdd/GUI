import angular from 'angular';
const {module, inject} = angular.mock;

describe('usage info', function () {
  'use strict';

  var ctrl, formatBytes, formatNumber, $scope, $exceptionHandler, localApply, stream, fs;

  beforeEach(module('dashboard'));

  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();

    formatBytes = {};
    formatNumber = {};

    $exceptionHandler = jasmine.createSpy('$exceptionHandler');
    localApply = jasmine.createSpy('localApply');

    stream = highland();

    ctrl = $controller('UsageInfoController', {
      $scope: $scope,
      $exceptionHandler: $exceptionHandler,
      formatBytes: formatBytes,
      formatNumber: formatNumber,
      localApply: localApply
    }, {
      stream: stream,
      id: '1',
      prefix: 'bytes'
    });
  }));

  it('should format as bytes', function () {
    expect(ctrl.format).toBe(formatBytes);
  });

  it('should add a generateStats method', function () {
    expect(ctrl.generateStats).toEqual(jasmine.any(Function));
  });

  it('should set id on the controller', function () {
    expect(ctrl.id).toBe('1');
  });

  it('should set s2 on the controller', function () {
    expect(highland.isStream(ctrl.s2)).toBe(true);
  });

  describe('with id', function () {
    beforeEach(function () {
      fs = {
        id: '1',
        bytes_free: 10000,
        bytes_total: 100000,
        filesfree: 50000,
        filestotal: 500000
      };

      stream.write([
        fs, {
          id: '2',
          bytes_free: 20000,
          bytes_total: 300000,
          filesfree: 40000,
          filestotal: 600000
        }]);
    });

    it('should call localApply', function () {
      expect(localApply).toHaveBeenCalledOnceWith(
        $scope,
        {
          id: '1',
          bytes_free: 10000,
          bytes_total: 100000,
          bytes_used: 90000,
          filesfree: 50000,
          filestotal: 500000
        });
    });

    it('should set data on the controller', function () {
      expect(ctrl.data).toEqual({
        id: '1',
        bytes_free: 10000,
        bytes_total: 100000,
        bytes_used: 90000,
        filesfree: 50000,
        filestotal: 500000
      });
    });

    it('should generate stats', function () {
      var results;

      ctrl.generateStats(ctrl.s2.property())
        .each(function (x) {
          results = x;
        });

      expect(results).toEqual([
        [
          {
            key: 'Free',
            y: 10000
          },
          {
            key: 'Used',
            y: 90000
          }
        ]
      ]);
    });
  });
});

import angular from 'angular';
const {module, inject} = angular.mock;

describe('HSM fs controller', function () {
  'use strict';

  var ctrl, $scope, $location, $routeSegment, fsStream, copytoolStream;

  beforeEach(module('hsmFs'));

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    $scope = $rootScope.$new();

    $routeSegment = {
      $routeParams: {
        fsId: '1'
      },
      getSegmentUrl: jasmine.createSpy('getSegmentUrl'),
      contains: jasmine.createSpy('contains').andReturn(true)
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    fsStream = highland();
    spyOn(fsStream, 'destroy');
    copytoolStream = highland();
    spyOn(copytoolStream, 'destroy');

    ctrl = $controller('HsmFsCtrl', {
      $scope: $scope,
      $routeSegment: $routeSegment,
      $location: $location,
      fsStream: fsStream.through(addProperty),
      copytoolStream: copytoolStream
    });
  }));

  it('should setup ctrl as expected', function () {
    expect(ctrl).toEqual({
      onUpdate: jasmine.any(Function),
      setConfigure: jasmine.any(Function)
    });
  });

  describe('onUpdate', function () {
    beforeEach(function () {
      $routeSegment.getSegmentUrl.andReturn('/configure/hsm');
    });

    it('should getSegmentUrl without id', function () {
      ctrl.onUpdate();

      expect($routeSegment.getSegmentUrl).toHaveBeenCalledOnceWith(
        'app.hsmFs.hsm',
        {
          fsId: ''
        }
      );
    });

    it('should getSegmentUrl with id', function () {
      ctrl.selectedFs = {
        id: '1'
      };

      ctrl.onUpdate();

      expect($routeSegment.getSegmentUrl).toHaveBeenCalledOnceWith(
        'app.hsmFs.hsm',
        {
          fsId: '1'
        }
      );
    });

    it('should set the new path', function () {
      ctrl.onUpdate();

      expect($location.path).toHaveBeenCalledOnceWith('/configure/hsm');
    });
  });

  it('should set the configure property', function () {
    ctrl.setConfigure(true);

    expect(ctrl.configure).toBe(true);
  });

  it('should set fileSystems data', function () {
    fsStream.write([{ id: '1' }, { id: '2' }]);

    expect(ctrl.fileSystems).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should set copytools data', function () {
    copytoolStream.write({
      objects: [{ id: '3'}, { id: '4' }]
    });

    expect(ctrl.copytools).toEqual([{ id: '3' }, { id: '4' }]);
  });

  it('should set fs to the fsId', function () {
    fsStream.write([{ id: '1', label: 'foo' }, { id: '2', label: 'bar' }]);

    expect(ctrl.fs).toEqual({ id: '1', label: 'foo' });
  });

  it('should filter out if fsId does not exist', function () {
    fsStream.write([{ id: '1' }]);

    $scope.$root.$broadcast('$routeChangeSuccess', {
      params: {}
    });

    expect(ctrl.fs).toBe(null);
  });

  it('should alter fs id on change', function () {
    fsStream.write([{ id: '1' }, { id: '3' }]);

    $scope.$root.$broadcast('$routeChangeSuccess', {
      params: {
        fsId: '3'
      }
    });

    expect(ctrl.fs).toEqual({ id: '3' });
  });

  it('should return early if redirectTo is set', function () {
    fsStream.write([{ id: '1' }, { id: '3' }]);

    $scope.$root.$broadcast('$routeChangeSuccess', {
      redirectTo: true,
      params: {
        fsId: '3'
      }
    });

    expect(ctrl.fs).toEqual({ id: '1' });
  });

  describe('destroy', function () {
    beforeEach(function () {
      $scope.$destroy();
    });

    it('should destroy the fsStream', function () {
      expect(fsStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the copytoolStream', function () {
      expect(copytoolStream.destroy).toHaveBeenCalledOnce();
    });

    it('should remove the routeChangeSuccess listener', inject(function ($rootScope) {
      expect($rootScope.$$listeners.$routeChangeSuccess).toEqual([null]);
    }));
  });
});

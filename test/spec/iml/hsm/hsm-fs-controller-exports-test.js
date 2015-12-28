import angular from 'angular';
const {module, inject} = angular.mock;
import λ from 'highland';
import {always} from 'intel-fp/fp';

describe('HSM fs controller', function () {
  var ctrl, $scope, $location, $routeSegment,
    fsStream, copytoolStream, routeStream, rs;

  beforeEach(module('hsmFs'));

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    $scope = $rootScope.$new();

    $routeSegment = {
      getSegmentUrl: jasmine.createSpy('getSegmentUrl')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    fsStream = highland();
    spyOn(fsStream, 'destroy');
    copytoolStream = highland();
    spyOn(copytoolStream, 'destroy');

    rs = λ();
    spyOn(rs, 'destroy');
    routeStream = jasmine.createSpy('routeStream')
      .andReturn(rs);
    rs.write({
      params: {
        fsId: '1'
      },
      contains: jasmine.createSpy('contains')
        .andReturn(true)
    });

    ctrl = $controller('HsmFsCtrl', {
      $scope,
      $routeSegment,
      $location,
      fsStream: fsStream.through(addProperty),
      copytoolStream,
      routeStream
    });
  }));

  it('should setup ctrl as expected', function () {
    expect(ctrl).toEqual({
      onUpdate: jasmine.any(Function)
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

  it('should set fileSystems data', function () {
    fsStream.write([{ id: '1' }, { id: '2' }]);

    expect(ctrl.fileSystems).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should set copytools data', function () {
    copytoolStream.write([{ id: '3' }, { id: '4' }]);

    expect(ctrl.copytools).toEqual([{ id: '3' }, { id: '4' }]);
  });

  it('should set fs to the fsId', function () {
    fsStream.write([
      {
        id: '1',
        label: 'foo'
      },
      {
        id: '2',
        label: 'bar'
      }
    ]);

    expect(ctrl.fs).toEqual({
      id: '1',
      label: 'foo'
    });
  });

  it('should filter out if fsId does not exist', function () {
    fsStream.write([{ id: '1' }]);

    rs.write({
      params: {},
      contains: always(true)
    });

    expect(ctrl.fs).toBe(null);
  });

  it('should alter fs id on change', function () {
    fsStream.write([{ id: '1' }, { id: '3' }]);

    rs.write({
      params: {
        fsId: '3'
      },
      contains: always(true)
    });

    expect(ctrl.fs).toEqual({ id: '3' });
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

    it('should destroy the routeStream', () => {
      expect(rs.destroy)
        .toHaveBeenCalledOnce();
    });
  });
});

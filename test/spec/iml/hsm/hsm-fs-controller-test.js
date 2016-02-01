import λ from 'highland';
import {always} from 'intel-fp';
import HsmFsCtrl from '../../../../source/iml/hsm/hsm-fs-controller';
import hsmFsModule from '../../../../source/iml/hsm/hsm-fs-module';

describe('HSM fs controller', function () {
  var ctrl, $scope, $location, $routeSegment,
    fsStream, routeStream, rs;

  beforeEach(module(hsmFsModule));

  beforeEach(inject(function ($controller, $rootScope, addProperty) {
    $scope = $rootScope.$new();

    $routeSegment = {
      getSegmentUrl: jasmine.createSpy('getSegmentUrl')
    };

    $location = {
      path: jasmine.createSpy('path')
    };

    fsStream = λ();
    spyOn(fsStream, 'destroy');

    rs = λ();
    spyOn(rs, 'destroy');
    routeStream = jasmine.createSpy('routeStream')
      .and.returnValue(rs);
    rs.write({
      params: {
        fsId: '1'
      },
      contains: jasmine.createSpy('contains')
        .and.returnValue(true)
    });

    ctrl = $controller('HsmFsCtrl', {
      $scope,
      $routeSegment,
      $location,
      fsStream: fsStream.through(addProperty),
      routeStream
    });
  }));

  it('should setup ctrl as expected', function () {
    const instance = window.extendWithConstructor(HsmFsCtrl, {
      onUpdate: jasmine.any(Function)
    });

    expect(ctrl).toEqual(instance);
  });

  describe('onUpdate', function () {
    beforeEach(function () {
      $routeSegment.getSegmentUrl.and.returnValue('/configure/hsm');
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

    it('should destroy the routeStream', () => {
      expect(rs.destroy)
        .toHaveBeenCalledOnce();
    });
  });
});

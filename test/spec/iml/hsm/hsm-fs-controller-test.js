import highland from 'highland';
import HsmFsCtrl from '../../../../source/iml/hsm/hsm-fs-controller';
import hsmFsModule from '../../../../source/iml/hsm/hsm-fs-module';
import broadcaster from '../../../../source/iml/broadcaster.js';

describe('HSM fs controller', () => {
  let ctrl, $scope, $state,
    fsStream, qsStream, qs$, fsStreamB;

  beforeEach(module(hsmFsModule));

  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(inject(($controller, $rootScope) => {
    $scope = $rootScope.$new();

    $state = {
      go: jasmine.createSpy('go'),
      router: {
        globals: {
          params: {
            fsId: '1'
          }
        }
      }
    };

    fsStream = highland();
    spyOn(fsStream, 'destroy');

    qs$ = highland();
    spyOn(qs$, 'destroy');
    qsStream = jasmine
      .createSpy('qsStream')
      .and
      .returnValue(qs$);
    qs$.write({
      qs: ''
    });
    jasmine.clock().tick();

    fsStreamB = broadcaster(fsStream);

    ctrl = $controller('HsmFsCtrl', {
      $scope,
      $state,
      fsStream: fsStreamB,
      qsStream
    });
  }));

  it('should setup ctrl as expected', () => {
    const instance = window.extendWithConstructor(HsmFsCtrl, {
      onUpdate: jasmine.any(Function)
    });

    expect(ctrl)
      .toEqual(instance);
  });

  describe('onUpdate', () => {
    it('should go to the new path without id', () => {
      ctrl.selectedFs = null;

      ctrl.onUpdate();

      expect($state.go)
        .toHaveBeenCalledOnceWith(
          'app.hsmFs.hsm',
        {
          fsId: ''
        }
        );
    });

    it('should go to the new path with id', () => {
      ctrl.selectedFs = {
        id: '1'
      };

      ctrl.onUpdate();

      expect($state.go)
        .toHaveBeenCalledOnceWith(
          'app.hsmFs.hsm',
        {
          fsId: '1'
        }
        );
    });
  });

  it('should set fileSystems data', () => {
    fsStream.write([
      { id: '1' },
      { id: '2' }
    ]);
    jasmine.clock().tick();

    expect(ctrl.fileSystems).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should set fs to the fsId', () => {
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
    jasmine.clock().tick();

    expect(ctrl.fs).toEqual({
      id: '1',
      label: 'foo'
    });
  });

  it('should filter out if fsId does not exist', () => {
    $state.router.globals.params.fsId = '';

    fsStream.write([
      { id: '1' }
    ]);

    qs$.write({
      qs: ''
    });
    jasmine.clock().tick();

    expect(ctrl.fs).toBe(null);
  });

  it('should alter fs id on change', () => {
    $state.router.globals.params.fsId = '3';

    fsStream.write([
      { id: '1' },
      { id: '3' }
    ]);

    qs$.write({
      qs: ''
    });
    jasmine.clock().tick();

    expect(ctrl.fs).toEqual({ id: '3' });
  });

  describe('destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it('should destroy the fsStream', () => {
      expect(fsStream.destroy)
        .toHaveBeenCalled();
    });

    it('should destroy the qsStream', () => {
      expect(qs$.destroy)
        .toHaveBeenCalled();
    });
  });
});

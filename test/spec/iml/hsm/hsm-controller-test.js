import highland from 'highland';
import '../../../angular-mock-setup.js';
import { extendWithConstructor } from '../../../test-utils.js';
import HsmCtrl from '../../../../source/iml/hsm/hsm-controller';

describe('HSM controller', () => {
  let hsm,
    $scope,
    agentVsCopytoolChart,
    openAddCopytoolModal,
    copytoolOperationStream,
    copytoolStream;

  beforeEach(
    inject(($controller, $rootScope, $q) => {
      $scope = $rootScope.$new();

      agentVsCopytoolChart = {
        stream: {
          destroy: jasmine.createSpy('destroy')
        }
      };

      copytoolOperationStream = highland();
      spyOn(copytoolOperationStream, 'destroy');
      copytoolStream = highland();
      spyOn(copytoolStream, 'destroy');

      openAddCopytoolModal = jasmine
        .createSpy('openAddCopytoolModal')
        .and.returnValue($q.resolve());

      hsm = $controller(HsmCtrl, {
        $scope,
        agentVsCopytoolChart,
        openAddCopytoolModal,
        copytoolStream,
        copytoolOperationStream
      });
    })
  );

  it('should setup controller as expected', () => {
    const scope = extendWithConstructor(HsmCtrl, {
      chart: agentVsCopytoolChart,
      openAddModal: jasmine.any(Function)
    });

    expect(hsm).toEqual(scope);
  });

  it('should propagate copytool changes', () => {
    copytoolStream.write(['foo']);

    expect(hsm.copytools).toEqual(['foo']);
  });

  it('should propagate copytoolOperations', () => {
    copytoolOperationStream.write(['bar']);

    expect(hsm.copytoolOperations).toEqual(['bar']);
  });

  describe('open modal', () => {
    beforeEach(() => {
      hsm.openAddModal();
    });

    it('should set modalOpen property to true', () => {
      expect(hsm.modalOpen).toBe(true);
    });

    it('should open the modal', () => {
      expect(openAddCopytoolModal).toHaveBeenCalledOnceWith($scope);
    });

    it('should set modalOpen property to false on close', () => {
      $scope.$apply();
      expect(hsm.modalOpen).toBe(false);
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });

    it('should destroy the copytoolStream', () => {
      expect(copytoolStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the copytoolOperationStream', () => {
      expect(copytoolOperationStream.destroy).toHaveBeenCalledTimes(1);
    });

    it('should destroy the chart', () => {
      expect(agentVsCopytoolChart.stream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});

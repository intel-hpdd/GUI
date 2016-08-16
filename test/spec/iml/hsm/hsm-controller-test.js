import highland from 'highland';

import HsmCtrl from '../../../../source/iml/hsm/hsm-controller';

describe('HSM controller', () => {
  var hsm, $scope, agentVsCopytoolChart, openAddCopytoolModal,
    copytoolOperationStream, copytoolStream;

  beforeEach(module('hsm'));

  beforeEach(inject(($controller, $rootScope, $q) => {
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

    openAddCopytoolModal = jasmine.createSpy('openAddCopytoolModal')
      .and.returnValue($q.resolve());

    hsm = $controller('HsmCtrl', {
      $scope: $scope,
      agentVsCopytoolChart,
      openAddCopytoolModal,
      copytoolStream,
      copytoolOperationStream
    });
  }));

  it('should setup controller as expected', () => {
    const scope = window.extendWithConstructor(HsmCtrl, {
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
      expect(copytoolStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the copytoolOperationStream', () => {
      expect(copytoolOperationStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the chart', () => {
      expect(agentVsCopytoolChart.stream.destroy)
        .toHaveBeenCalledOnce();
    });
  });
});

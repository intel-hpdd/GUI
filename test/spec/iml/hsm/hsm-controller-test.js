describe('HSM controller', function () {
  'use strict';

  var configs;

  beforeEach(module(function () {
    configs = angular.module('hsm')._configBlocks;
    angular.module('hsm')._configBlocks = [];
  }, 'hsm'));

  afterEach(function () {
    angular.module('hsm')._configBlocks = configs;
  });

  var hsm, $scope, getAgentVsCopytoolStream, openAddCopytoolModal,
    copytoolOperationStream, copytoolStream;

  beforeEach(inject(function ($controller, $rootScope, $q) {
    $scope = $rootScope.$new();

    getAgentVsCopytoolStream = jasmine.createSpy('getAgentVsCopytoolStream')
      .andReturn('agent vs copytool stream');

    copytoolOperationStream = highland();
    spyOn(copytoolOperationStream, 'destroy');
    copytoolStream = highland();
    spyOn(copytoolStream, 'destroy');

    openAddCopytoolModal = jasmine.createSpy('openAddCopytoolModal')
      .andReturn($q.resolve());

    hsm = $controller('HsmCtrl', {
      $scope: $scope,
      openAddCopytoolModal: openAddCopytoolModal,
      copytoolStream: copytoolStream,
      copytoolOperationStream: copytoolOperationStream,
      getAgentVsCopytoolStream: getAgentVsCopytoolStream
    });
  }));

  it('should setup controller as expected', function () {
    expect(hsm).toEqual({
      stream: 'agent vs copytool stream',
      data: [],
      openAddModal: jasmine.any(Function)
    });
  });

  it('should propagate copytool changes', function () {
    copytoolStream.write(['foo']);

    expect(hsm.copytools).toEqual(['foo']);
  });

  it('should propagate copytoolOperations', function () {
    copytoolOperationStream.write(['bar']);

    expect(hsm.copytoolOperations).toEqual(['bar']);
  });

  describe('open modal', function () {
    var result;

    beforeEach(function () {
      result = hsm.openAddModal();
    });

    it('should set modalOpen property to true', function () {
      expect(hsm.modalOpen).toBe(true);
    });

    it('should open the modal', function () {
      expect(openAddCopytoolModal).toHaveBeenCalledOnceWith($scope);
    });

    it('should set modalOpen property to false on close', function () {
      $scope.$apply();
      expect(hsm.modalOpen).toBe(false);
    });
  });

  describe('on destroy', function () {
    beforeEach(function () {
      $scope.$destroy();
    });

    it('should destroy the copytoolStream', function () {
      expect(copytoolStream.destroy).toHaveBeenCalledOnce();
    });

    it('should destroy the copytoolOperationStream', function () {
      expect(copytoolOperationStream.destroy).toHaveBeenCalledOnce();
    });
  });
});

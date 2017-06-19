import highland from 'highland';
import TargetDashboardController
  from '../../../../source/iml/dashboard/target-dashboard-controller';
import broadcaster from '../../../../source/iml/broadcaster.js';
import angular from '../../../angular-mock-setup.js';

describe('target dashboard', () => {
  let $scope, ctrl, charts, targetStream, usageStream;
  beforeEach(
    angular.mock.inject($rootScope => {

      $scope = $rootScope.$new();
      charts = [{ stream: { destroy: jest.fn() } }];
      jest.spyOn(charts[0].stream, 'destroy');
      targetStream = highland();
      jest.spyOn(targetStream, 'destroy');
      usageStream = highland();
      jest.spyOn(usageStream, 'destroy');
      ctrl = {};
      TargetDashboardController.bind(ctrl)(
        $scope,
        { kind: 'MDT' },
        charts,
        targetStream,
        broadcaster(usageStream)
      );
    })
  );

  it('should setup the controller', () => {
    const scope = {
      ...TargetDashboardController,
      ...{
        charts,
        usageStream: expect.any(Function),
        kind: 'MDT'
      }
    };
    expect(ctrl).toEqual(scope);
  });
  it('should set data on the controller', () => {
    targetStream.write('foo');
    expect(ctrl.target).toEqual('foo');
  });
  describe('on destroy', () => {
    beforeEach(() => {
      $scope.$destroy();
    });
    it('should destroy the target stream', () => {
      expect(targetStream.destroy).toHaveBeenCalledTimes(1);
    });
    it('should destroy the usage stream', () => {
      expect(usageStream.destroy).toHaveBeenCalledTimes(1);
    });
    it('should destroy the charts', () => {
      expect(charts[0].stream.destroy).toHaveBeenCalledTimes(1);
    });
  });
});

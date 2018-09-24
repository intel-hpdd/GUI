import highland from "highland";
import BaseDashboardCtrl from "../../../../source/iml/dashboard/base-dashboard-controller";
import broadcaster from "../../../../source/iml/broadcaster.js";
import angular from "../../../angular-mock-setup.js";

describe("base dashboard controller", () => {
  let $scope, fsStream, charts, baseDashboardCtrl, chart;
  beforeEach(
    angular.mock.inject(($rootScope, propagateChange) => {
      fsStream = highland();
      jest.spyOn(fsStream, "destroy");
      $scope = $rootScope.$new();
      jest.spyOn($scope, "localApply");
      jest.spyOn($scope, "handleException");
      chart = { stream: { destroy: jest.fn() } };
      charts = [Object.create(chart), Object.create(chart)];
      baseDashboardCtrl = {};
      BaseDashboardCtrl.bind(baseDashboardCtrl)($scope, broadcaster(fsStream), charts, propagateChange);
    })
  );
  it("should setup the controller", () => {
    const scope = {
      ...BaseDashboardCtrl,
      ...{
        fs: [],
        fsB: expect.any(Function),
        charts: charts
      }
    };
    expect(baseDashboardCtrl).toEqual(scope);
  });
  describe("streaming data", () => {
    beforeEach(() => {
      fsStream.write([{ id: 1 }]);
    });
    it("should wire up the fs stream", () => {
      expect(baseDashboardCtrl.fs).toEqual([
        {
          id: 1,
          STATES: Object.freeze({ MONITORED: "monitored", MANAGED: "managed" }),
          state: "managed"
        }
      ]);
    });
  });
  describe("on destroy", () => {
    beforeEach(() => {
      $scope.$destroy();
    });
    it("should destroy the stream", () => {
      expect(fsStream.destroy).toHaveBeenCalledTimes(1);
    });
    it("should destroy the charts", () => {
      expect(chart.stream.destroy).toHaveBeenCalledTimes(2);
    });
  });
});

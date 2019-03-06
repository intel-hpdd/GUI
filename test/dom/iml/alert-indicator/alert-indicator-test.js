import highland from "highland";
import broadcast from "../../../../source/iml/broadcaster.js";
import { default as AlertIndicator, alertIndicatorNg } from "../../../../source/iml/alert-indicator/alert-indicator.js";
import { renderToSnapshot } from "../../../test-utils.js";
import angular from "../../../angular-mock-setup.js";

describe("AlertIndicator DOM testing", () => {
  let alertStream, recordId, displayType, node, popover, i, stream, stateLabel, alerts, tooltip, template, $scope;

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component("alertIndicator", alertIndicatorNg);
    })
  );

  beforeEach(
    angular.mock.inject(($compile, $rootScope) => {
      stream = highland();

      alertStream = broadcast(stream);

      recordId = "host/6";

      displayType = "medium";

      stream.write([]);

      $scope = $rootScope.$new();
      $scope.recordId = recordId;
      $scope.displayType = displayType;
      $scope.alertStream = alertStream;
      template = '<alert-indicator record-id="recordId" display-type="displayType" alert-stream="alertStream" />';

      node = $compile(template)($scope)[0];
      $scope.$digest();

      document.body.appendChild(node);

      popover = node.querySelector.bind(node, ".popover");
      i = node.querySelector.bind(node, "i");
      alerts = node.querySelectorAll.bind(node, "li");

      stateLabel = node.querySelector.bind(node, ".state-label");

      tooltip = node.querySelector.bind(node, ".tooltip");
    })
  );

  afterEach(() => {
    $scope.$destroy();
    document.body.removeChild(node);
  });

  describe("response contains alerts", () => {
    let response;

    beforeEach(() => {
      response = [
        {
          affected: ["host/6"],
          message: "response message"
        },
        {
          affected: ["host/6"],
          message: "response message 2"
        }
      ];

      stream.write(response);
      i().click();
      $scope.$digest();
    });

    it("should have an alert message if the response contains one.", () => {
      expect(alerts()[0].textContent).toEqual("response message");
    });

    it("should add more alerts when added", () => {
      response.push({
        affected: ["host/6"],
        message: "response message 3"
      });
      stream.write(response);

      expect(alerts()[2].textContent).toEqual("response message 3");
    });

    it("should remove old alerts", () => {
      response.pop();
      stream.write(response);

      expect(alerts().length).toBe(1);
    });

    it("should hide the popover if there are no alerts", () => {
      stream.write([]);

      expect(popover()).toBeNull();
    });

    it("should show the label", () => {
      expect(stateLabel().textContent).toEqual("2 Issues");
    });
  });

  describe("exclamation icon interaction", () => {
    beforeEach(() => {
      const response = [
        {
          affected: ["host/6"],
          message: "response message"
        }
      ];

      stream.write(response);
    });

    it("should display the info icon", () => {
      expect(i()).toBeShown();
    });

    it("should display the popover after clicking info icon", () => {
      i().click();

      expect(popover()).toBeShown();
    });

    it("should display the tooltip after mousing over the info icon", () => {
      i().dispatchEvent(new MouseEvent("mouseover"));
      expect(tooltip()).toBeShown();
    });

    it("should not show the label on small size", () => {
      expect(
        renderToSnapshot(<AlertIndicator viewer={alertStream} size="small" recordId={recordId} />)
      ).toMatchSnapshot();
    });
  });
});

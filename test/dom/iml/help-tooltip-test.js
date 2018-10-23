// @flow
import angular from "../../angular-mock-setup.js";
import { querySelector } from "../../../source/iml/dom-utils.js";

describe("help tooltip", () => {
  let root, helpTooltip: HTMLElement, mockHelpText, $scope, $compile, template;

  beforeEach(
    angular.mock.module($compileProvider => {
      mockHelpText = { my_key: "your value" };
      jest.mock("../../../source/iml/environment.js", () => ({
        HELP_TEXT: mockHelpText
      }));

      $compileProvider.directive("helpTooltip", require("../../../source/iml/tooltip/tooltip.js").helpTooltip);
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    })
  );

  describe("with a message", () => {
    beforeEach(() => {
      $scope.moreClasses = ["extra-class"];
      template = '<help-tooltip topic="my_key" direction="bottom" more-classes="moreClasses"></help-tooltip>';
      root = $compile(template)($scope)[0];
      $scope.$digest();

      helpTooltip = querySelector(root, ".inferno-tt");
    });

    it("should render the helpTooltip", () => {
      expect(helpTooltip).not.toBeNull();
    });

    it("should have the helpTooltip class", () => {
      expect(helpTooltip.classList).toContain("tooltip");
    });

    it("should have the inferno-tt class", () => {
      expect(helpTooltip.classList).toContain("inferno-tt");
    });

    it("should have the position class", () => {
      expect(helpTooltip.classList).toContain("bottom");
    });

    it("should have the extra class", () => {
      expect(helpTooltip.classList).toContain("extra-class");
    });

    it("should have the helpTooltip-arrow", () => {
      const helpTooltipArrow = querySelector(helpTooltip, ".tooltip-arrow");
      expect(helpTooltipArrow).not.toBeNull();
    });

    it("should have an inner section with a message", () => {
      const tooltipInner = querySelector(helpTooltip, ".tooltip-inner");
      expect(tooltipInner.textContent).toEqual("your value");
    });
  });

  describe("without a message", () => {
    let helpTooltip: ?HTMLElement;

    beforeEach(() => {
      $scope.moreClasses = ["extra-class"];
      template = '<help-tooltip topic="" direction="bottom" more-classes="moreClasses"></help-tooltip>';
      root = $compile(template)($scope)[0];
      $scope.$digest();

      helpTooltip = root.querySelector(".inferno-tt");
    });

    it("should not render a tooltip", () => {
      expect(helpTooltip).toBeNull();
    });
  });
});

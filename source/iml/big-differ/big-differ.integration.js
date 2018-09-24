import angular from "../../../test/angular-mock-setup.js";
import bigDifferModule from "./big-differ-module";

describe("big differ integration test", () => {
  beforeEach(() => {
    if (!window.angular) require("angular");
  });

  beforeEach(angular.mock.module(bigDifferModule));

  let $scope, el, resetButton, cleanRecordButton, differEl, input;

  beforeEach(
    angular.mock.inject(($compile, $rootScope) => {
      $scope = $rootScope.$new();

      $scope.inputModel = "foo";
      $scope.getMessage = state => {
        return state.local;
      };

      const template = `
      <div>
        <diff-container>
          <differ>
            <input ng-model="inputModel" diff-model />
            <reset-diff on-message="getMessage(state)"></reset-diff>
          </differ>
          <a class="reset-btn" ng-click="diffContainer.reset();" ng-disabled="diffContainer.noSubmit();"></a>
        </diff-container>
      </div>
    `;

      el = $compile(template)($scope)[0];
      $scope.$digest();

      resetButton = el.querySelector.bind(el, ".reset-btn");
      cleanRecordButton = el.querySelector.bind(el, ".clean-record");
      differEl = el.querySelector.bind(el, "differ > div");
      input = el.querySelector.bind(el, "input");
    })
  );

  it("should have the reset button disabled", () => {
    expect(resetButton().disabled).toBe(true);
  });

  it("should not render the clean record button", () => {
    expect(cleanRecordButton()).toBe(null);
  });

  describe("tooltip message", () => {
    let text;

    beforeEach(() => {
      document.body.appendChild(el);
      const mouseOver = new MouseEvent("mouseover");

      input().value = "bar";

      const event = new Event("input");
      input().dispatchEvent(event);
      $scope.$digest();

      cleanRecordButton().dispatchEvent(mouseOver);
      $scope.$digest();

      text = document.body.querySelector(".tooltip .tooltip-inner").textContent;
    });

    it("should put text in tooltip", () => {
      expect(text).toBe("bar");
    });

    afterEach(() => {
      document.body.removeChild(el);
    });
  });

  describe("local change", () => {
    beforeEach(() => {
      input().value = "bar";

      const event = new Event("input");
      input().dispatchEvent(event);
      $scope.$digest();
    });

    it("should have the reset button enabled", () => {
      expect(resetButton().disabled).toBe(false);
    });

    it("should render the clean record button", () => {
      expect(cleanRecordButton()).not.toBe(null);
    });

    it("should add the local change class", () => {
      expect(differEl().classList.contains("local")).toBe(true);
    });

    it("should reset the state when reset button is clicked", () => {
      resetButton().click();

      expect(input().value).toBe("foo");
    });

    it("should reset the state when clean record button is clicked", () => {
      cleanRecordButton().click();

      expect(input().value).toBe("foo");
    });
  });

  describe("remote change", () => {
    beforeEach(() => {
      $scope.inputModel = "bar";
      $scope.$digest();
    });

    it("should have the reset button enabled", () => {
      expect(resetButton().disabled).toBe(false);
    });

    it("should render the clean record button", () => {
      expect(cleanRecordButton()).not.toBe(null);
    });

    it("should add the remote change class", () => {
      expect(differEl().classList.contains("remote")).toBe(true);
    });

    it("should reset the state to remote when reset button is clicked", () => {
      resetButton().click();

      expect(input().value).toBe("bar");
    });

    it("should reset the state to remote when clean record button is clicked", () => {
      cleanRecordButton().click();

      expect(input().value).toBe("bar");
    });
  });

  describe("conflict change", () => {
    beforeEach(() => {
      $scope.inputModel = "bar";
      $scope.$digest();

      input().value = "bap";
      const event = new Event("input");
      input().dispatchEvent(event);
      $scope.$digest();
    });

    it("should have the reset button enabled", () => {
      expect(resetButton().disabled).toBe(false);
    });

    it("should render the clean record button", () => {
      expect(cleanRecordButton()).not.toBe(null);
    });

    it("should add the remote change class", () => {
      expect(differEl().classList.contains("conflict")).toBe(true);
    });

    it("should reset the state to remote when reset button is clicked", () => {
      resetButton().click();

      expect(input().value).toBe("bar");
    });

    it("should reset the state to remote when clean record button is clicked", () => {
      cleanRecordButton().click();

      expect(input().value).toBe("bar");
    });
  });
});

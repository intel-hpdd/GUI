// @flow

import angular from "../../../angular-mock-setup.js";

describe("action dropdown directive", () => {
  let actionDropdown, template, $compile, $scope, seedApp, record1, lock1;
  let mockGetRandomValue, mockGlobal;

  beforeEach(() => {
    mockGetRandomValue = jest.fn(() => 7);
    jest.mock("../../../../source/iml/get-random-value.js", () => mockGetRandomValue);

    seedApp = {
      destroy: jest.fn(),
      free: jest.fn(),
      set_locks: jest.fn()
    };

    mockGlobal = {
      wasm_bindgen: {
        deferred_action_dropdown_component: jest.fn(() => seedApp)
      }
    };
    jest.mock("../../../../source/iml/global.js", () => mockGlobal);

    actionDropdown = require("../../../../source/iml/action-dropdown/action-dropdown.js").actionDropdown;
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component("actionDropdown", actionDropdown);
    })
  );

  beforeEach(() => {
    record1 = {
      content_type_id: 89,
      id: 1,
      label: "label",
      resource_uri: "/api/target/1",
      state: "pending",
      address: "address",
      server_profile: {
        initial_state: "active"
      },
      install_method: "method"
    };

    lock1 = {
      content_type_id: 21,
      id: 17,
      label: "lock_label",
      hsm_control_params: null
    };
  });

  describe("normal button", () => {
    beforeEach(
      angular.mock.inject((_$compile_, $rootScope) => {
        $compile = _$compile_;
        $scope = $rootScope.$new();

        $scope.record = record1;
        $scope.locks = [lock1];

        template = `<action-dropdown record="record" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should initialize the component", () => {
      expect(mockGlobal.wasm_bindgen.deferred_action_dropdown_component).toHaveBeenCalledTimes(1);
      expect(mockGlobal.wasm_bindgen.deferred_action_dropdown_component).toHaveBeenCalledWith(
        {
          record: record1,
          locks: [lock1],
          flag: "flag",
          tooltip_placement: "left",
          tooltip_size: "large"
        },
        expect.any(Object)
      );
    });

    it("should update the locks", () => {
      expect(seedApp.set_locks).toHaveBeenCalledTimes(1);
      expect(seedApp.set_locks).toHaveBeenCalledWith([lock1]);
    });

    describe("on destroy", () => {
      beforeEach(() => {
        $scope.$destroy();
      });

      it("should destroy the seed app", () => {
        expect(seedApp.destroy).toHaveBeenCalledTimes(1);
      });

      it("should free the seed app", () => {
        expect(seedApp.free).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("button that will manually update", () => {
    beforeEach(
      angular.mock.inject((_$compile_, $rootScope) => {
        $compile = _$compile_;
        $scope = $rootScope.$new();

        $scope.record = {};
        $scope.locks = [lock1];

        template = `<action-dropdown record="record" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" update="true" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should initialize the component", () => {
      expect(mockGlobal.wasm_bindgen.deferred_action_dropdown_component).toHaveBeenCalledTimes(1);
      expect(mockGlobal.wasm_bindgen.deferred_action_dropdown_component).toHaveBeenCalledWith(
        {
          record: {},
          locks: [lock1],
          flag: "flag",
          tooltip_placement: "left",
          tooltip_size: "large"
        },
        expect.any(Object)
      );
    });

    it("should update the locks", () => {
      expect(seedApp.set_locks).toHaveBeenCalledTimes(1);
      expect(seedApp.set_locks).toHaveBeenCalledWith([lock1]);
    });
  });
});

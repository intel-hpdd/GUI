// @flow

import angular from "../../../angular-mock-setup.js";

describe("action dropdown directive", () => {
  let actionDropdown, template, $compile, $scope, seedApp, record1, hsmRecord, lock1;
  let mockGetRandomValue, mockGlobal;

  beforeEach(() => {
    mockGetRandomValue = jest.fn(() => 7);
    jest.mock("../../../../source/iml/get-random-value.js", () => mockGetRandomValue);

    seedApp = {
      destroy: jest.fn(),
      free: jest.fn(),
      set_hsm_records: jest.fn(),
      set_records: jest.fn(),
      set_locks: jest.fn()
    };

    mockGlobal = {
      wasm_bindgen: {
        init: jest.fn(() => seedApp)
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

    hsmRecord = {
      content_type_id: 89,
      id: 1,
      label: "label",
      resource_uri: "/api/target/1",
      state: "pending",
      address: "address",
      server_profile: {
        initial_state: "active"
      },
      install_method: "method",
      hsm_control_params: {
        long_description: "long_description",
        param_key: "key",
        param_value: "value",
        verb: "verb",
        mdt: {
          id: "7",
          kind: "kind",
          resource: "resource",
          conf_params: {}
        }
      }
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

        $scope.records = [record1];
        $scope.locks = [lock1];

        template = `<action-dropdown records="records" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should initialize the component", () => {
      expect(mockGlobal.wasm_bindgen.init).toHaveBeenCalledTimes(1);
      expect(mockGlobal.wasm_bindgen.init).toHaveBeenCalledWith(
        {
          uuid: "7",
          records: [record1],
          locks: [lock1],
          flag: "flag",
          tooltip_placement: "left",
          tooltip_size: "large"
        },
        expect.any(Object)
      );
    });

    it("should not manually set records", () => {
      expect(seedApp.set_records).not.toHaveBeenCalled();
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

        $scope.records = [];
        $scope.locks = [lock1];

        template = `<action-dropdown records="records" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" update="true" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should initialize the component", () => {
      expect(mockGlobal.wasm_bindgen.init).toHaveBeenCalledTimes(1);
      expect(mockGlobal.wasm_bindgen.init).toHaveBeenCalledWith(
        {
          uuid: "7",
          records: [],
          locks: [lock1],
          flag: "flag",
          tooltip_placement: "left",
          tooltip_size: "large"
        },
        expect.any(Object)
      );
    });

    it("should not have set records yet", () => {
      expect(seedApp.set_records).not.toHaveBeenCalled();
    });

    it("should update the locks", () => {
      expect(seedApp.set_locks).toHaveBeenCalledTimes(1);
      expect(seedApp.set_locks).toHaveBeenCalledWith([lock1]);
    });

    describe("after setting records", () => {
      beforeEach(() => {
        $scope.records = [record1];
        $scope.$digest();
      });

      it("should set records", () => {
        expect(seedApp.set_records).toHaveBeenCalledTimes(1);
        expect(seedApp.set_records).toHaveBeenCalledWith([record1]);
      });
    });
  });

  describe("with hsm records and normal records and won't update", () => {
    beforeEach(
      angular.mock.inject((_$compile_, $rootScope) => {
        $compile = _$compile_;
        $scope = $rootScope.$new();

        $scope.records = [hsmRecord, record1];
        $scope.locks = [lock1];

        template = `<action-dropdown records="records" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should manually set hsm records", () => {
      expect(seedApp.set_hsm_records).toHaveBeenCalledTimes(1);
      expect(seedApp.set_hsm_records).toHaveBeenCalledWith([hsmRecord]);
    });

    it("should not manually set records", () => {
      expect(seedApp.set_records).not.toHaveBeenCalled();
    });
  });

  describe("with both hsm records and normal records and will update", () => {
    beforeEach(
      angular.mock.inject((_$compile_, $rootScope) => {
        $compile = _$compile_;
        $scope = $rootScope.$new();

        $scope.records = [hsmRecord, record1];
        $scope.locks = [lock1];

        template = `<action-dropdown records="records" locks="locks" flag="flag" tooltip_placement="left" tooltip_size="large" update="true" />`;
        $compile(template)($scope)[0];
      })
    );

    afterEach(() => {
      $scope.$destroy();
    });

    it("should manually set hsm records", () => {
      expect(seedApp.set_hsm_records).toHaveBeenCalledTimes(1);
      expect(seedApp.set_hsm_records).toHaveBeenCalledWith([hsmRecord]);
    });

    it("should manually set records", () => {
      expect(seedApp.set_records).toHaveBeenCalledTimes(1);
      expect(seedApp.set_records).toHaveBeenCalledWith([record1]);
    });
  });
});

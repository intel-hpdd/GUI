// @flow

import angular from "../../../angular-mock-setup.js";
import highland, { type HighlandStreamT } from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import type { State } from "../../../../source/iml/storage/storage-reducer.js";

describe("storage component", () => {
  let mockStore,
    storage$: HighlandStreamT<State>,
    alertIndicator$: HighlandStreamT<Object[]>,
    $compile,
    $scope,
    template,
    el;

  beforeEach(
    angular.mock.module($compileProvider => {
      mockStore = { dispatch: jest.fn() };
      jest.mock("../../../../source/iml/store/get-store.js", () => mockStore);

      const mockStorageResources = jest.fn(() => highland([]));
      jest.mock("../../../../source/iml/storage/storage-resources.js", () => mockStorageResources);

      $compileProvider.component("storage", require("../../../../source/iml/storage/storage-component.js").default);

      storage$ = highland();
      alertIndicator$ = highland();
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    })
  );

  beforeEach(() => {
    $scope.storageB = broadcaster(storage$);
    $scope.alertIndicatorB = broadcaster(alertIndicator$);
    template = '<storage storage-b="storageB" alert-indicator-b="alertIndicatorB"></storage>';
  });

  it("should render no plugins", () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: "name",
        loading: false,
        selectIndex: 0,
        entries: 10,
        offset: 0
      },
      resourceClasses: [],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 0
        },
        objects: []
      }
    });

    el = $compile(template)($scope)[0];
    $scope.$digest();

    expect(el).toMatchSnapshot();
  });

  it("should render with plugins", () => {
    storage$.write({
      config: {
        sortDesc: false,
        sortKey: "name",
        loading: true,
        selectIndex: 0,
        entries: 1,
        offset: 0
      },
      resourceClasses: [
        {
          class_name: "EMCPower",
          columns: [
            {
              label: "Size",
              name: "size"
            },
            {
              label: "Filesystem type",
              name: "filesystem_type"
            },
            {
              label: "Uuid",
              name: "uuid"
            }
          ],
          fields: [
            {
              class: "Bytes",
              label: "Size",
              name: "size",
              optional: false,
              user_read_only: false
            },
            {
              class: "Boolean",
              label: "Filesystem type",
              name: "filesystem_type",
              optional: true,
              user_read_only: false
            },
            {
              class: "String",
              label: "Uuid",
              name: "uuid",
              optional: false,
              user_read_only: false
            }
          ],
          id: 1,
          label: "linux-EMCPower",
          modified_at: "2017-07-19T13:58:02.615410",
          plugin_internal: true,
          plugin_name: "linux",
          resource_uri: "/api/storage_resource_class/1/",
          user_creatable: false
        }
      ],
      resources: {
        meta: {
          limit: 10,
          next: null,
          offset: 0,
          previous: null,
          total_count: 1
        },
        objects: []
      }
    });

    el = $compile(template)($scope)[0];
    $scope.$digest();

    expect(el).toMatchSnapshot();
  });
});

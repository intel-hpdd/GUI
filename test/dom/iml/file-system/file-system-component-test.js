import highland from "highland";
import broadcaster from "../../../../source/iml/broadcaster.js";
import angular from "../../../angular-mock-setup.js";
import fileSystemComponent from "../../../../source/iml/file-system/file-system-component.js";
import asValueModule from "../../../../source/iml/as-value/as-value-module.js";
import asStreamModule from "../../../../source/iml/as-stream/as-stream-module.js";
import extractApiFilterModule from "../../../../source/iml/extract-api-filter/extract-api-filter-module.js";

describe("file system component", () => {
  beforeEach(
    angular.mock.module(asValueModule, asStreamModule, extractApiFilterModule, $compileProvider => {
      $compileProvider.component("fileSystem", fileSystemComponent);
    })
  );

  let el, $scope;

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      $scope = $rootScope.$new();
      $scope.fileSystem$ = highland();
      $scope.alertIndicator$ = broadcaster(highland());
      $scope.locks = [];

      const template = `
    <file-system file-system-$="fileSystem$" alert-indicator-$="alertIndicator$"
         locks="locks"></file-system>
    `;

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  describe("without data", () => {
    beforeEach(() => {
      $scope.fileSystem$.write([]);
    });

    it("should render no data message", () => {
      expect(el.querySelector(".no-fs h1")).toHaveText("No File Systems are configured");
    });

    it("should render a create file system button", () => {
      expect(el.querySelector(".no-fs a").getAttribute("route-to")).toBe("configure/filesystem/create/");
    });
  });

  describe("with data", () => {
    beforeEach(() => {
      $scope.fileSystem$.write([
        {
          id: 1,
          resource_uri: "/api/filesystem/1",
          label: "fs1",
          name: "fs1",
          client_count: 2,
          bytes_total: 10000,
          bytes_free: 10000,
          available_actions: [],
          mgt: {
            primary_server_name: "test001",
            primary_server: "/api/host/1"
          },
          mdts: [
            {
              resource_uri: "/api/target/3"
            }
          ]
        }
      ]);
    });

    it("should render the title", () => {
      expect(el.querySelector(".section-header")).toHaveText("File Systems");
    });

    it("should render the fs name", () => {
      expect(el.querySelector("td")).toHaveText("fs1");
    });

    it("should link to the fs detail page", () => {
      expect(el.querySelector("td a").getAttribute("route-to")).toBe("configure/filesystem/1");
    });

    it("should link to the server detail page", () => {
      expect(el.querySelectorAll("td a")[1].getAttribute("route-to")).toBe("configure/server/1");
    });

    it("should render the primary management server", () => {
      expect(el.querySelectorAll("td a")[1]).toHaveText("test001");
    });

    it("should render the metadata server count", () => {
      expect(el.querySelectorAll("td")[3]).toHaveText("1");
    });

    it("should render the connected clients", () => {
      expect(el.querySelectorAll("td")[4]).toHaveText("2");
    });

    it("should include the action dropdown", () => {
      expect(el.querySelector("action-dropdown")).not.toBeNull();
    });
  });
});

// @flow

import angular from "../../../angular-mock-setup.js";
import jobIndicator from "../../../../source/iml/job-indicator/job-indicator.js";
import imlPopover from "../../../../source/iml/iml-popover.js";
import { imlTooltip } from "../../../../source/iml/tooltip/tooltip.js";
import Position from "../../../../source/iml/position.js";

describe("job indicator", () => {
  let $rootScope, $scope, $timeout, el;

  beforeEach(
    angular.mock.module(($provide, $compileProvider) => {
      $provide.service("position", Position);
      $compileProvider.component("jobIndicator", jobIndicator);
      $compileProvider.directive("imlTooltip", imlTooltip);
      $compileProvider.directive("imlPopover", imlPopover);
    })
  );

  describe("basic state", () => {
    beforeEach(
      angular.mock.inject(function(_$rootScope_, $compile, _$timeout_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        const template = '<job-indicator record-id="id" content-type-id="contentTypeId" locks="locks" />';

        $scope = $rootScope.$new();
        $scope.id = 1;
        $scope.contentTypeId = 98;
        $scope.locks = [];

        el = $compile(template)($scope)[0];
        $scope.$digest();
      })
    );

    it("should render basic state", () => {
      expect(el).toMatchSnapshot();
    });
  });

  describe("with write locks", () => {
    let btn;
    beforeEach(
      angular.mock.inject(function(_$rootScope_, $compile, _$timeout_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        const template = '<job-indicator record-id="id" content-type-id="contentTypeId" locks="locks" />';

        $scope = $rootScope.$new();
        $scope.id = 1;
        $scope.contentTypeId = 98;
        $scope.locks = [
          {
            action: "add",
            content_type_id: 98,
            description: "Some write lock",
            item_id: 1,
            job_id: 7,
            lock_type: "write"
          }
        ];

        el = $compile(template)($scope)[0];
        $scope.$digest();

        btn = el.querySelector(".activate-popover");
      })
    );

    it("should render hover state", () => {
      btn.dispatchEvent(new MouseEvent("hover"));
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });

    it("should render popover state", () => {
      btn.click();
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });
  });

  describe("with read locks", () => {
    let btn;
    beforeEach(
      angular.mock.inject(function(_$rootScope_, $compile, _$timeout_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        const template = '<job-indicator record-id="id" content-type-id="contentTypeId" locks="locks" />';

        $scope = $rootScope.$new();
        $scope.id = 1;
        $scope.contentTypeId = 98;
        $scope.locks = [
          {
            action: "add",
            content_type_id: 98,
            description: "Some read lock",
            item_id: 1,
            job_id: 7,
            lock_type: "read"
          }
        ];

        el = $compile(template)($scope)[0];
        $scope.$digest();

        btn = el.querySelector(".activate-popover");
      })
    );

    it("should render hover state", () => {
      btn.dispatchEvent(new MouseEvent("hover"));
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });

    it("should render popover state", () => {
      btn.click();
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });
  });

  describe("with read and write locks", () => {
    let btn;
    beforeEach(
      angular.mock.inject(function(_$rootScope_, $compile, _$timeout_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        const template = '<job-indicator record-id="id" content-type-id="contentTypeId" locks="locks" />';

        $scope = $rootScope.$new();
        $scope.id = 1;
        $scope.contentTypeId = 98;
        $scope.locks = [];

        el = $compile(template)($scope)[0];
        $scope.$digest();

        $scope.locks = [
          {
            action: "add",
            content_type_id: 98,
            description: "Some write lock",
            item_id: 1,
            job_id: 2,
            lock_type: "write"
          },
          {
            action: "add",
            content_type_id: 98,
            description: "Some read lock",
            item_id: 1,
            job_id: 3,
            lock_type: "read"
          }
        ];
        $scope.$digest();

        btn = el.querySelector(".activate-popover");
      })
    );

    it("should render hover state", () => {
      btn.dispatchEvent(new MouseEvent("hover"));
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });

    it("should render popover state", () => {
      btn.click();
      $timeout.flush();

      expect(el).toMatchSnapshot();
    });
  });

  describe("triggering a change without locks", () => {
    beforeEach(
      angular.mock.inject(function(_$rootScope_, $compile, _$timeout_) {
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;

        const template = '<job-indicator record-id="id" content-type-id="contentTypeId" locks="locks" />';

        $scope = $rootScope.$new();
        $scope.id = 1;
        $scope.contentTypeId = 98;
        $scope.locks = [
          {
            action: "add",
            content_type_id: 98,
            description: "Some read lock",
            item_id: 1,
            job_id: 7,
            lock_type: "read"
          }
        ];

        el = $compile(template)($scope)[0];
        $scope.$digest();
      })
    );

    it("should not update the messages", () => {
      $scope.locks = null;
      $scope.$digest();

      expect(el).toMatchSnapshot();
    });
  });
});

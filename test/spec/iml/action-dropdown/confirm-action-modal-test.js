import angular from "../../../angular-mock-setup.js";
import uiBootstrapModule from "angular-ui-bootstrap";

import {
  openConfirmActionModalFactory,
  ConfirmActionModalCtrl
} from "../../../../source/iml/action-dropdown/confirm-action-modal.js";

describe("confirm action modal", function() {
  beforeEach(() => {
    if (!window.angular) require("angular");
  });

  beforeEach(
    angular.mock.module(uiBootstrapModule, ($compileProvider, $provide, $controllerProvider) => {
      $provide.factory("openConfirmActionModal", openConfirmActionModalFactory);

      $controllerProvider.register("ConfirmActionModalCtrl", ConfirmActionModalCtrl);
    })
  );

  describe("confirm action modal", function() {
    let confirmAction, title, confirmPrompts;

    beforeEach(
      angular.mock.inject(function($rootScope, $controller) {
        const $scope = $rootScope.$new();

        title = "The Title";
        confirmPrompts = [];

        $controller("ConfirmActionModalCtrl", {
          $scope: $scope,
          title: title,
          confirmPrompts: confirmPrompts
        });

        confirmAction = $scope.confirmAction;
      })
    );

    it("should have a title property", function() {
      expect(confirmAction.title).toEqual("The Title");
    });

    it("should set the confirmPrompts", function() {
      expect(confirmAction.confirmPrompts).toEqual([]);
    });
  });

  describe("open confirm action modal", function() {
    let $uibModal, openConfirmActionModal;

    beforeEach(
      angular.mock.module(function($provide) {
        $uibModal = {
          open: jest.fn()
        };

        $provide.value("$uibModal", $uibModal);
      })
    );

    let title, confirmPrompts;

    beforeEach(
      angular.mock.inject(function(_openConfirmActionModal_) {
        title = "The title";
        confirmPrompts = [];

        openConfirmActionModal = _openConfirmActionModal_;
        openConfirmActionModal(title, confirmPrompts);
      })
    );

    it("should open the modal as expected", function() {
      expect($uibModal.open).toHaveBeenCalledOnceWith({
        backdrop: "static",
        backdropClass: "confirm-action-modal-backdrop",
        controller: "ConfirmActionModalCtrl",
        windowClass: "confirm-action-modal",
        template: expect.any(String),
        resolve: {
          title: expect.any(Function),
          confirmPrompts: expect.any(Function)
        }
      });
    });

    describe("resolves", function() {
      let resolve;

      beforeEach(function() {
        resolve = $uibModal.open.mock.calls[0][0].resolve;
      });

      it("should set the title", function() {
        expect(resolve.title()).toEqual(title);
      });

      it("should set the confirm prompts", function() {
        expect(resolve.confirmPrompts()).toEqual([]);
      });
    });
  });
});

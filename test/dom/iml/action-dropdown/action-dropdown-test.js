import highland from "highland";
import * as fp from "@iml/fp";
import { imlTooltip } from "../../../../source/iml/tooltip/tooltip.js";
import groupActionsFilter from "../../../../source/iml/action-dropdown/group-actions.js";
import * as maybe from "@iml/maybe";
import angular from "../../../angular-mock-setup.js";
import uiBootstrapModule from "angular-ui-bootstrap";

describe("action dropdown directive", () => {
  let handleAction, openCommandModal, mockGetCommandStream, cleanText;

  beforeEach(() => {
    if (!window.angular) require("angular");
  });

  beforeEach(
    angular.mock.module(uiBootstrapModule, ($compileProvider, $provide, $controllerProvider, $filterProvider) => {
      handleAction = jest.fn(() => highland());
      $provide.value("handleAction", handleAction);
      mockGetCommandStream = jest.fn(() => highland());
      $provide.value("getCommandStream", mockGetCommandStream);
      openCommandModal = jest.fn();
      $provide.value("openCommandModal", openCommandModal);
      $filterProvider.register("groupActions", groupActionsFilter);
      $compileProvider.directive("imlTooltip", imlTooltip);
      cleanText = x => x.textContent && x.textContent.trim();

      jest.mock("../../../../source/iml/command/get-command-stream.js", () => mockGetCommandStream);

      const {
        ActionDropdownCtrl,
        actionDropdown,
        actionDescriptionCache
      } = require("../../../../source/iml/action-dropdown/action-dropdown.js");
      $provide.factory("actionDescriptionCache", actionDescriptionCache);
      $controllerProvider.register("ActionDropdownCtrl", ActionDropdownCtrl);
      $compileProvider.directive("actionDropdown", actionDropdown);

      jest.useFakeTimers();
    })
  );
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  let $scope, $timeout, el, button, records, groupHeaders, buttonGroup, verbs, tooltip, tooltipText;
  describe("before records are sent", () => {
    beforeEach(
      angular.mock.inject(($compile, $rootScope) => {
        $scope = $rootScope.$new();
        $scope.stream = highland();
        const template = '<action-dropdown stream="stream"></action-dropdown>';
        el = $compile(template)($scope)[0];
        document.body.appendChild(el);
        $scope.$digest();
        button = el.querySelector.bind(el, "button");
      })
    );
    afterEach(() => {
      document.body.removeChild(el);
    });
    it("should have the standard actions button", () => {
      expect(cleanText(button())).toEqual("Actions");
    });
  });
  describe("without records", () => {
    beforeEach(
      angular.mock.inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.stream = highland();
        $scope.stream.write([]);
        const template = '<action-dropdown stream="stream"></action-dropdown>';
        el = $compile(template)($scope)[0];
        document.body.appendChild(el);
        $scope.$digest();
        button = el.querySelector.bind(el, "button");
      })
    );
    afterEach(() => {
      document.body.removeChild(el);
    });
    it("should have a no actions button", () => {
      expect(cleanText(button())).toEqual("No Actions");
    });
  });
  describe("with records", () => {
    beforeEach(
      angular.mock.inject(function($compile, $rootScope, _$timeout_) {
        $scope = $rootScope.$new();
        $timeout = _$timeout_;
        $scope.stream = highland();
        records = [
          {
            label: "server001",
            available_actions: [
              {
                args: { host_id: 2 },
                class_name: "ShutdownHostJob",
                confirmation:
                  "Initiate an orderly shutdown on the host. Any HA-capable targets running on the host will  be failed over to a peer. Non-HA-capable targets will be unavailable until the host has been restarted.",
                display_group: 2,
                display_order: 60,
                long_description:
                  "Initiate an orderly shutdown on the host.  Any HA-capable targets running on the host will  be failed over to a peer. Non-HA-capable targets will be unavailable until the host has been restarted.",
                verb: "Shutdown"
              },
              {
                args: { host_id: 2 },
                class_name: "RebootHostJob",
                confirmation: null,
                display_group: 2,
                display_order: 50,
                long_description:
                  "Initiate a reboot on the host. Any HA-capable targets running on the host will be  failed over to a peer. Non-HA-capable targets will be unavailable until the host has finished rebooting.",
                verb: "Reboot"
              }
            ],
            locks: { write: [] }
          },
          {
            available_actions: [
              {
                display_group: 3,
                display_order: 100,
                long_description: "Shut down the LNet networking layer and stop any targets running on this server.",
                state: "lnet_down",
                verb: "Stop LNet"
              },
              {
                display_group: 3,
                display_order: 110,
                long_description:
                  "If LNet is running, stop LNET and unload the LNet kernel module to ensure that  it will be reloaded before any targets are started again.",
                state: "lnet_unloaded",
                verb: "Unload LNet"
              }
            ],
            content_type_id: 163,
            host: "/api/host/1/",
            id: "1",
            immutable_state: false,
            label: "lnet configuration",
            locks: { read: [], write: [] },
            nids: ["/api/nid/4/"],
            not_deleted: true,
            resource_uri: "/api/lnet_configuration/1/",
            state: "lnet_up",
            state_modified_at: "2015-09-08T23:48:57.747771+00:00"
          }
        ];
        $scope.stream.write(records);
        const template = '<action-dropdown stream="stream"></action-dropdown>';
        el = $compile(template)($scope)[0];
        document.body.appendChild(el);
        $scope.$digest();
        button = el.querySelector.bind(el, "button");
        buttonGroup = el.querySelector.bind(el, ".btn-group");
        verbs = el.querySelectorAll.bind(el, "li a");
        groupHeaders = el.querySelectorAll.bind(el, "li.dropdown-header");
        tooltip = document.body.querySelector.bind(document.body, ".tooltip");
        tooltipText = document.body.querySelector.bind(document.body, ".tooltip .tooltip-inner");
      })
    );
    afterEach(() => {
      document.body.removeChild(el);
    });
    it("should display the first header", () => {
      expect(cleanText(maybe.fromJust(fp.head(groupHeaders())))).toEqual("server001");
    });
    it("should display the second header", () => {
      expect(cleanText(groupHeaders()[1])).toEqual("lnet configuration");
    });
    it("should display a divider between groups", () => {
      expect(el.querySelector(".divider")).not.toBeNull();
    });
    it("should have an actions dropdown button", () => {
      expect(cleanText(button())).toEqual("Actions");
    });
    it("should put the highest order host action last", () => {
      expect(cleanText(verbs()[1])).toEqual("Shutdown");
    });
    it("should put the lowest order host action first", () => {
      expect(cleanText(maybe.fromJust(fp.head(verbs())))).toEqual("Reboot");
    });
    it("should put the highest order LNet action last", () => {
      expect(cleanText(verbs()[2])).toEqual("Stop LNet");
    });
    it("should put the lowest order LNet action first", () => {
      expect(cleanText(verbs()[3])).toEqual("Unload LNet");
    });
    it("should show the dropdown on click", () => {
      button().click();
      expect(buttonGroup().classList.contains("open")).toBe(true);
    });
    describe("mouseover a verb", () => {
      beforeEach(() => {
        button().click();
        const mouseOver = new MouseEvent("mouseenter");
        maybe.fromJust(fp.head(verbs())).dispatchEvent(mouseOver);
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });
      afterEach(() => {
        const tt = tooltip();
        tt.parentNode.removeChild(tt);
      });
      it("should append the tooltip", () => {
        expect(tooltip()).not.toBeNull();
      });
      it("should should show the long description", () => {
        expect(cleanText(tooltipText())).toEqual(records[0].available_actions[0].long_description);
      });
      it("should update the long_description if it changes", () => {
        records[0].available_actions[0].long_description = "Description of action word";
        $scope.stream.write(records);
        jest.runAllTimers();
        expect(cleanText(tooltipText())).toEqual("Description of action word");
      });
    });
    describe("clicking a verb", () => {
      beforeEach(() => {
        button().click();
        maybe.fromJust(fp.head(verbs())).click();
      });
      it("should cause the action to be handled", () => {
        expect(handleAction).toHaveBeenCalledOnceWith(records[0], records[0].available_actions[0]);
      });
      it("should disable the button", () => {
        expect(button().disabled).toBe(true);
      });
      it("should remove the dropdown", () => {
        expect(el.querySelector("ul")).toBeNull();
      });
    });
    it("should disable the button if there are write locks", () => {
      records[0].locks.write.push("locked ya!");
      $scope.stream.write(records);
      jest.runAllTimers();
      expect(button().disabled).toBe(true);
    });
    it("should update the verb if it changes", () => {
      records = JSON.parse(JSON.stringify(records));
      records[0].available_actions[0].verb = "Action Word";
      $scope.stream.write(records);
      jest.runAllTimers();
      expect(cleanText(maybe.fromJust(fp.head(verbs())))).toEqual("Action Word");
    });
  });
});

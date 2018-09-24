import angular from "../../../angular-mock-setup.js";

import completionistModule from "../../../../source/iml/completionist/completionist-module.js";

describe("completionist dropdown", () => {
  let completionistDropdown, completionist, localApply, $scope;

  beforeEach(
    angular.mock.module(completionistModule, $provide => {
      localApply = jest.fn();

      $provide.value("localApply", localApply);
    })
  );

  beforeEach(
    angular.mock.inject(($componentController, $rootScope) => {
      $scope = $rootScope.$new();
      completionist = {
        register: jest.fn(),
        deregister: jest.fn(),
        emit: jest.fn()
      };

      completionistDropdown = $componentController(
        "completionistDropdown",
        {
          $scope
        },
        {
          completionist
        }
      );
      completionistDropdown.$onInit();
    })
  );

  it("should emit a value on select", () => {
    completionistDropdown.onSelect("foo");

    expect(completionist.emit).toHaveBeenCalledOnceWith("VALUE", "foo");
  });

  it("should set an active index", () => {
    completionistDropdown.setActive(5);

    expect(completionistDropdown.index).toEqual(5);
  });

  describe("on destroy", () => {
    beforeEach(() => {
      completionistDropdown.$onDestroy();
    });

    it("should deregister key presses", () => {
      expect(completionist.deregister).toHaveBeenCalledOnceWith("KEY_PRESS", expect.any(Function));
    });

    it("should deregister values", () => {
      expect(completionist.deregister).toHaveBeenCalledOnceWith("VALUES", expect.any(Function));
    });
  });

  describe("on key press", () => {
    let onKeyPress, data;

    beforeEach(() => {
      data = {
        event: {
          preventDefault: jest.fn()
        }
      };

      completionistDropdown.values = [1];

      onKeyPress = completionist.register.mock.calls[0][1];
    });

    describe("escape", () => {
      beforeEach(() => {
        data.name = "escape";

        onKeyPress(data);
      });

      it("should empty values", () => {
        expect(completionist.emit).toHaveBeenCalledOnceWith("VALUES", []);
      });

      it("should prevent default", () => {
        expect(data.event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe("up", () => {
      beforeEach(() => {
        data.name = "up";
        onKeyPress(data);
      });

      it("should reset the index", () => {
        expect(completionistDropdown.index).toBe(0);
      });

      it("should call localApply", () => {
        expect(localApply).toHaveBeenCalledOnceWith($scope);
      });

      it("should prevent default", () => {
        expect(data.event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe("down", () => {
      beforeEach(() => {
        data.name = "down";
        onKeyPress(data);
      });

      it("should reset the index", () => {
        expect(completionistDropdown.index).toBe(0);
      });

      it("should call localApply", () => {
        expect(localApply).toHaveBeenCalledOnceWith($scope);
      });

      it("should prevent default", () => {
        expect(data.event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });

    describe("enter", () => {
      beforeEach(() => {
        completionistDropdown.index = 0;
        data.name = "enter";
        onKeyPress(data);
      });

      it("should emit the new value", () => {
        expect(completionist.emit).toHaveBeenCalledOnceWith("VALUE", 1);
      });

      it("should prevent default", () => {
        expect(data.event.preventDefault).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("on values", () => {
    beforeEach(() => {
      completionistDropdown.index = 3;
      completionist.register.mock.calls[1][1]([1, 2, 3]);
    });

    it("should set index to -1", () => {
      expect(completionistDropdown.index).toBe(-1);
    });

    it("should set new values", () => {
      expect(completionistDropdown.values).toEqual([1, 2, 3]);
    });

    it("should call localApply", () => {
      expect(localApply).toHaveBeenCalledOnceWith($scope);
    });
  });
});

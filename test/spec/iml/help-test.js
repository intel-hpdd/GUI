import angular from "../../angular-mock-setup.js";
import helpFactory from "../../../source/iml/help.js";

describe("Help", () => {
  let help;

  beforeEach(
    angular.mock.module($provide => {
      $provide.constant("HELP_TEXT", {
        foo: "bar"
      });
      $provide.factory("help", helpFactory);
    })
  );

  beforeEach(
    angular.mock.inject(_help_ => {
      help = _help_;
    })
  );

  it("should provide the sce value", () => {
    expect(help.get("foo").valueOf()).toBe("bar");
  });

  it("should provide the same instance if called twice", () => {
    expect(help.get("foo")).toBe(help.get("foo"));
  });

  it("should throw if a non-existent key is fetched", () => {
    expect(help.get.bind(null, "not a real value")).toThrow();
  });
});

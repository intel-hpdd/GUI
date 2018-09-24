import mod from "../../../../source/iml/qs-from-location/qs-from-location.js";

describe("qs from location", () => {
  let qsFromLocation, mockFormat;

  beforeEach(() => {
    mockFormat = jest.fn();
    const state = {
      router: {
        urlMatcherFactory: {
          paramTypes: "paramTypes",
          UrlMatcher: jest.fn(() => ({
            format: mockFormat
          }))
        }
      },
      transition: {
        to: jest.fn(() => ({
          url: "/status?severity&record_type"
        }))
      }
    };

    qsFromLocation = mod(state);
  });

  it("should be a function", function() {
    expect(qsFromLocation).toEqual(expect.any(Function));
  });

  describe("with valid params", () => {
    let result;
    beforeEach(() => {
      mockFormat.mockReturnValueOnce("/status?severity=info&record_type=active");

      result = qsFromLocation({ severity: "info", record_type: "active" });
    });

    it("should return the qs", function() {
      expect(result).toEqual("severity=info&record_type=active");
    });
  });

  it("should return an empty string for no qs", function() {
    mockFormat.mockReturnValueOnce("/status");

    expect(qsFromLocation({})).toEqual("");
  });
});

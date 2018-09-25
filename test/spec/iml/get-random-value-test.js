describe("get random value", () => {
  let mockGetRandomValues, getRandomValue;

  beforeEach(() => {
    mockGetRandomValues = jest.fn(() => [2]);

    jest.mock("../../../source/iml/global.js", () => ({
      crypto: {
        getRandomValues: mockGetRandomValues
      }
    }));

    getRandomValue = require("../../../source/iml/get-random-value.js").default;
  });

  it("should be called with a Uint32Array", () => {
    getRandomValue();

    expect(mockGetRandomValues).toHaveBeenCalledOnceWith(new Uint32Array(1));
  });

  it("should return the result of crypto.getRandomValues", () => {
    expect(getRandomValue()).toBe(2);
  });
});

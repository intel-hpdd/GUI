const toHaveBeenCalledNTimesWith = n =>
  function matcherFactory(received, ...rest) {
    if (!jest.isMockFunction(received))
      return {
        pass: false,
        message: () =>
          `Expected a mock, but got ${this.utils.printReceived(received)}.`
      };

    const foundCount = received.mock.calls.reduce((count, args) => {
      if (this.equals(args, rest)) count += 1;

      return count;
    }, 0);

    const result = {
      pass: this.equals(foundCount, n)
    };

    if (result.pass)
      result.message = () =>
        `Expected mock ${this.utils.printReceived(received)} not to have been called with ${rest} ${n} time(s) but it was.`;
    else
      result.message = () =>
        `Expect mock to be called with ${this.utils.printExpected(rest)} ${this.utils.pluralize('time', n)} but it was called ${this.utils.pluralize('time', foundCount)}.\n\nMock this.utils.printReceived(received) call listing:\n${received.mock.calls}.`;

    return result;
  };

expect.extend({
  toHaveBeenCalledOnceWith: toHaveBeenCalledNTimesWith(1),
  toHaveBeenCalledTwiceWith: toHaveBeenCalledNTimesWith(2),
  toHaveBeenCalledThriceWith: toHaveBeenCalledNTimesWith(3),
  toHaveBeenCalledNTimesWith: toHaveBeenCalledNTimesWith(null)
});

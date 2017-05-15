const isSpy = obj => obj.calls != null && obj.and != null;

const toHaveBeenCalledNTimesWith = (n: number) =>
  function matcherFactory(received, ...rest) {
    if (!jest.isMockFunction(received) && !isSpy(received))
      return {
        pass: false,
        message: () =>
          `Expected a mock, but got ${this.utils.printReceived(received)}.`
      };

    const calls = isSpy(received) ? received.calls.all() : received.mock.calls;
    const incrementCount = (count, args) => {
      if (this.equals(args, rest)) count += 1;
      return count;
    };
    const reducer = isSpy(received)
      ? (count, { args }) => incrementCount(count, args)
      : (count, args) => incrementCount(count, args);

    const foundCount = calls.reduce(reducer, 0);

    const result = {
      pass: this.equals(foundCount, n)
    };

    if (result.pass)
      result.message = () =>
        `Expected mock ${this.utils.printReceived(received)} not to have been called with ${rest} ${n} time(s) but it was.`;
    else
      result.message = () =>
        `Expect mock to be called with ${this.utils.printExpected(rest)} ${this.utils.pluralize('time', n)} but it was called ${this.utils.pluralize('time', foundCount)}.\n\nMock this.utils.printReceived(received) call listing:\n${calls}.`;

    return result;
  };

expect.extend({
  toHaveBeenCalledOnceWith: toHaveBeenCalledNTimesWith(1),
  toHaveBeenCalledTwiceWith: toHaveBeenCalledNTimesWith(2),
  toHaveBeenCalledThriceWith: toHaveBeenCalledNTimesWith(3),
  toHaveBeenCalledNTimesWith: toHaveBeenCalledNTimesWith(null),
  toHaveClass(el, clazz) {
    if (!(el instanceof Element)) el = el[0];

    if (el.classList.contains(clazz))
      return {
        pass: true,
        message: `Expected '${this.utils.stringify(el)}' not to have class '${clazz}'.`
      };
    else
      return {
        pass: false,
        message: `Expected '${this.utils.stringify(el)}' to have class '${clazz}'.`
      };
  },
  toBeShown(el) {
    if (!(el instanceof Element)) el = el[0];

    if (el && !el.classList.contains('ng-hide'))
      return {
        pass: true,
        message: "Expected element to have 'ng-hide' class."
      };
    else
      return {
        pass: false,
        message: "Expected element not to have 'ng-hide' class."
      };
  }
});

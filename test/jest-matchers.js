const toHaveBeenCalledNTimesWith = (n: number) =>
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
        `Expect mock to be called with ${this.utils.printExpected(rest)} ${this.utils.pluralize('time', n)} but it was called ${this.utils.pluralize('time', foundCount)}.\n\nMock this.utils.printReceived(received) call listing:\n${this.utils.stringify(received.mock.calls)}.`;

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
  },
  toBeAPromise(actual) {
    const isPromiseLike = obj => obj && typeof obj.then === 'function';

    if (isPromiseLike(actual))
      return {
        pass: true,
        message: 'Expected object to be a promise'
      };
    else
      return {
        pass: false,
        message: 'Expected object not to be a promise'
      };
  }
});

afterEach(() => {
  window.angular = null;
  window.d3 = null;
  window.nvd3 = null;
});

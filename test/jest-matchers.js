const stringy = o => JSON.stringify(o, null, 2);

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
        `Expected mock ${this.utils.printReceived(
          received
        )} not to have been called with ${rest} ${n} time(s) but it was.`;
    else
      result.message = () =>
        `Expect mock to be called with ${this.utils.printExpected(
          rest
        )} ${this.utils.pluralize(
          'time',
          n
        )} but it was called ${this.utils.pluralize(
          'time',
          foundCount
        )}.\n\nMock this.utils.printReceived(received) call listing:\n${this.utils.stringify(
          received.mock.calls
        )}.`;

    return result;
  };

const cssMatcher = (presentClasses, absentClasses) =>
  function matcherFactory(el) {
    if (!(el instanceof Element)) el = el[0];

    if (
      el.classList.contains(presentClasses) &&
      !el.classList.contains(absentClasses)
    )
      return {
        pass: true,
        message: `Expected '${this.utils.stringify(
          el
        )}' to have class '${presentClasses}'
            and not have class ${absentClasses}, but had ${el.className}.`
      };
    else
      return {
        pass: false,
        message: `Expected '${this.utils.stringify(
          el
        )}' not to have class '${presentClasses}'
            and to have class ${absentClasses}, but had ${el.className}.`
      };
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
        message: `Expected '${this.utils.stringify(
          el
        )}' not to have class '${clazz}'.`
      };
    else
      return {
        pass: false,
        message: `Expected '${this.utils.stringify(
          el
        )}' to have class '${clazz}'.`
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
  },
  toBeInvalid: cssMatcher('ng-invalid', 'ng-valid'),
  toBeValid: cssMatcher('ng-valid', 'ng-invalid'),
  toEqualComponent(component, expected) {
    const clean = s => s.replace(/^\s+/gm, '').replace(/\n/g, '');

    const cleanComponent = c => {
      if (c && c.template)
        c = {
          ...c,
          template: clean(c.template)
        };

      return c;
    };

    const eq = this.equals(cleanComponent(component), cleanComponent(expected));

    if (eq)
      return {
        pass: true,
        message: `expected ${stringy(component)} to equal ${stringy(expected)}`
      };
    else
      return {
        pass: false,
        message: `expected ${stringy(component)} not to equal ${stringy(
          expected
        )}`
      };
  },
  toContainItems: (xs: Object, items: Object) => {
    const entries = Object.entries(xs);
    const itemEntry = Object.entries(items);

    const hasEntries = itemEntry.every(([itemKey, itemVal]) =>
      entries.find(([key, val]) => key === itemKey && val === itemVal)
    );

    if (hasEntries)
      return {
        pass: true,
        message: `expected ${stringy(items)} not to be in ${stringy(xs)}`
      };
    else
      return {
        pass: false,
        message: `expected ${stringy(items)} to be in ${stringy(xs)}`
      };
  },
  toHaveText: (el, text) => {
    const elText = el.textContent.trim();

    if (elText === text)
      return {
        pass: true,
        message: `Expected '${elText}' not to be text '${text}'.`
      };
    else
      return {
        pass: false,
        message: `Expected '${elText}' to be text '${text}'.`
      };
  }
});

afterEach(() => {
  window.angular = null;
  window.d3 = null;
  window.nvd3 = null;
});

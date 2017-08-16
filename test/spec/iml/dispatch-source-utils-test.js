// @flow

describe('dispatch source utils', () => {
  let mockEnvironment, canDispatch;

  describe('when ALLOW_ANONYMOUS_READ is true', () => {
    beforeEach(() => {
      mockEnvironment = {
        ALLOW_ANONYMOUS_READ: true,
        CACHE_INITIAL_DATA: {
          session: {}
        }
      };

      jest.mock('../../../source/iml/environment.js', () => mockEnvironment);
      ({
        canDispatch
      } = require('../../../source/iml/dispatch-source-utils.js'));
    });

    it('should be allowed to dispatch', () => {
      expect(canDispatch()).toBe(true);
    });
  });

  describe('when ALLOW_ANONYMOUS_READ is false but a user exists on the session', () => {
    beforeEach(() => {
      mockEnvironment = {
        ALLOW_ANONYMOUS_READ: false,
        CACHE_INITIAL_DATA: {
          session: {
            user: { name: 'bob' }
          }
        }
      };

      jest.mock('../../../source/iml/environment.js', () => mockEnvironment);
      ({
        canDispatch
      } = require('../../../source/iml/dispatch-source-utils.js'));
    });

    it('should be allowed to dispatch', () => {
      expect(canDispatch()).toBe(true);
    });
  });

  describe('when ALLOW_ANONYMOUS_READ is false and no user on the session', () => {
    beforeEach(() => {
      mockEnvironment = {
        ALLOW_ANONYMOUS_READ: false,
        CACHE_INITIAL_DATA: {
          session: {
            user: null
          }
        }
      };

      jest.mock('../../../source/iml/environment.js', () => mockEnvironment);
      ({
        canDispatch
      } = require('../../../source/iml/dispatch-source-utils.js'));
    });

    it('should be allowed to dispatch', () => {
      expect(canDispatch()).toBe(false);
    });
  });
});

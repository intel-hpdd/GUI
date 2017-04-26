import regenerator from '../../../source/iml/regenerator.js';

describe('Regenerator module', () => {
  let setup, teardown, getter;

  beforeEach(() => {
    setup = jest.fn(() => 'setup');
    teardown = jest.fn();
    getter = regenerator(setup, teardown);
  });

  describe('getting an object from the cache', () => {
    describe("item hasn't been created in the cache yet", () => {
      beforeEach(() => {
        getter('item');
      });

      it('should not call the tear down function', () => {
        expect(teardown).not.toHaveBeenCalledOnceWith();
      });

      it('should call the setup function', () => {
        expect(setup).toHaveBeenCalledTimes(1);
      });
    });

    describe('item already in the cache', () => {
      beforeEach(() => {
        getter('item');
        getter('item');
      });

      it('should call the teardown function once', () => {
        expect(teardown).toHaveBeenCalledOnceWith('setup');
      });

      it('should call setup twice', () => {
        expect(setup).toHaveBeenCalledTwiceWith();
      });
    });
  });

  describe('destroying the objects in the cache', () => {
    beforeEach(() => {
      getter('item');
      getter.destroy();
    });

    it('should call tear down', () => {
      expect(teardown).toHaveBeenCalledTimes(1);
    });
  });
});

import regenerator from '../../../source/iml/regenerator.js';

describe('Regenerator module', () => {
  let setup, teardown, getter;

  beforeEach(() => {
    setup = jasmine.createSpy('setup').and.returnValue('setup');
    teardown = jasmine.createSpy('teardown');
    getter = regenerator(setup, teardown);
  });

  describe('getting an object from the cache', function() {
    describe("item hasn't been created in the cache yet", function() {
      beforeEach(function() {
        getter('item');
      });

      it('should not call the tear down function', function() {
        expect(teardown).not.toHaveBeenCalled();
      });

      it('should call the setup function', function() {
        expect(setup).toHaveBeenCalledOnce();
      });
    });

    describe('item already in the cache', function() {
      beforeEach(function() {
        getter('item');
        getter('item');
      });

      it('should call the teardown function once', function() {
        expect(teardown).toHaveBeenCalledOnceWith('setup');
      });

      it('should call setup twice', function() {
        expect(setup).toHaveBeenCalledTwice();
      });
    });
  });

  describe('destroying the objects in the cache', function() {
    beforeEach(function() {
      getter('item');
      getter.destroy();
    });

    it('should call tear down', function() {
      expect(teardown).toHaveBeenCalledOnce();
    });
  });
});

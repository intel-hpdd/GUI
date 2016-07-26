import highland from 'highland';

import {
  addCurrentPage,
  rememberValue
} from '../../../source/iml/api-transforms.js';

describe('api transforms', () => {
  describe('add current page', () => {
    it('should return 1 if limit is 0', () => {
      const result = addCurrentPage({
        meta: {
          limit: 0,
          offset: 10
        }
      });

      expect(result)
        .toEqual({
          meta: {
            limit: 0,
            offset: 10,
            current_page: 1
          }
        });
    });

    it('should calculate offset over limit plus 1', () => {
      const result = addCurrentPage({
        meta: {
          limit: 20,
          offset: 20
        }
      });

      expect(result)
        .toEqual({
          meta: {
            limit: 20,
            offset: 20,
            current_page: 2
          }
        });
    });
  });

  describe('remember value', () => {
    let spy,
      in$,
      transformFn;

    beforeEach(() => {
      transformFn = jasmine
        .createSpy('transformFn');

      spy = jasmine.createSpy('spy');
      in$ = highland();

      rememberValue(transformFn, in$)
        .each(spy);

      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });


    it('should remember on a value', () => {
      transformFn
        .and
        .callFake(s => highland([s]));

      in$
        .write('foo');

      jasmine.clock().tick();

      expect(spy)
        .toHaveBeenCalledOnceWith('foo');
    });

    it('should remember when no value', () => {
      transformFn
        .and
        .callFake(() => highland([]));

      in$
        .write('foo');

      in$.end();

      jasmine.clock().tick();

      expect(spy)
        .toHaveBeenCalledOnceWith('foo');
    });

    it('should call the transform fn', () => {
      transformFn
        .and
        .callFake(() => highland([]));

      in$
        .write('foo');

      expect(transformFn)
        .toHaveBeenCalledOnceWith('foo');
    });
  });
});

import {
  addCurrentPage
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
});

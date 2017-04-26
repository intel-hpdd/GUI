import highland from 'highland';
import * as maybe from '@mfl/maybe';
describe('tree transforms', () => {
  let getChildBy, emitOnItem, hasChanges, transformItems;
  beforeEach(() => {
    const mod = require('../../../../source/iml/tree/tree-transforms.js');
    ({ getChildBy, emitOnItem, hasChanges, transformItems } = mod);
  });
  describe('getChildBy', () => {
    let spy, s;
    beforeEach(() => {
      s = highland();
      spy = jest.fn();

      getChildBy(x => x.id === 1)(s).each(spy);
    });

    it('should return the match', () => {
      s.write({ '1': { id: 1 } });
      expect(spy).toHaveBeenCalledOnceWith(maybe.ofJust({ id: 1 }));
    });

    it('should return false', () => {
      s.write({ '2': { id: 2 } });
      expect(spy).toHaveBeenCalledOnceWith(maybe.ofNothing());
    });
  });
  describe('emitOnItem', () => {
    let s, spy;
    beforeEach(() => {
      s = highland();
      spy = jest.fn();
      emitOnItem(x => x.id === 1)(s).each(spy);
    });
    it('should emit the value', () => {
      s.write({ '1': { id: 1 } });
      expect(spy).toHaveBeenCalledOnceWith({ id: 1 });
    });
    it('should emit nothing', () => {
      s.write({ '2': { id: 2 } });
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('hasChanges', () => {
    let changed;
    beforeEach(() => {
      changed = hasChanges(x => x.id);
    });
    it('should return true on first call', () => {
      expect(changed({ id: 1 })).toBe(true);
    });
    it('should return true when data changes', () => {
      changed({ id: 1 });
      expect(changed({ id: 2 })).toBe(true);
    });
    it('should return false when data does not change', () => {
      changed({ id: 1 });
      expect(changed({ id: 1 })).toBe(false);
    });
  });
  describe('transformItems', () => {
    let s, transformer;
    beforeEach(() => {
      s = highland();
      transformer = transformItems(
        x => x.parentId === 0,
        () => ({ type: 'host' }),
        () => highland([{ meta: { offset: 0, limit: 20 } }])
      )(s);
    });
    it('should return a new addTreeItem', done => {
      s.write({ '1': { parentId: 0, meta: { offset: 0, limit: 20 } } });
      transformer.each(x => {
        expect(x).toEqual({
          type: 'ADD_TREE_ITEMS',
          payload: [
            { parentId: 0, meta: { offset: 0, limit: 20, current_page: 1 } }
          ]
        });
        done();
      });
    });
    it('should add a new id on no match', done => {
      s.write({ '2': { parentId: 1 } });
      transformer.each(x => {
        expect(x).toEqual({
          type: 'ADD_TREE_ITEMS',
          payload: [
            {
              type: 'host',
              open: false,
              opens: {},
              treeId: 1,
              meta: { offset: 0, limit: 20, current_page: 1 }
            }
          ]
        });
        done();
      });
    });
  });
});

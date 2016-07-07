// @flow

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('tree actions', () => {
  let addTreeItems,
    createItem,
    toggleCollectionOpen,
    toggleItemOpen;

  beforeEachAsync(async function () {
    const mod = await mock('source/iml/tree/tree-actions.js', {});

    ({
      addTreeItems,
      toggleCollectionOpen,
      toggleItemOpen,
      createItem
    } = mod);
  });

  afterEach(resetAll);

  describe('add tree items', () => {
    it('should return an addItemsActionT', () => {
      const resp = addTreeItems([{
        parentTreeId: 0,
        type: 'foo',
        treeId: 1,
        open: false,
        opens: {},
        meta: {
          offset: 0,
          limit: 20
        }
      }]);

      expect(resp)
        .toEqual({
          type: 'ADD_TREE_ITEMS',
          payload: [{
            parentTreeId: 0,
            type: 'foo',
            treeId: 1,
            open: false,
            opens: {},
            meta: {
              offset: 0,
              limit: 20
            }
          }]
        });
    });
  });

  describe('toggle collection open', () => {
    it('should return a toggleCollectionOpenT', () => {
      const resp = toggleCollectionOpen(1, true);

      expect(resp)
        .toEqual({
          type: 'TOGGLE_COLLECTION_OPEN',
          payload: {
            id: 1,
            open: true
          }
        });
    });
  });

  describe('toggle item open', () => {
    it('should return a toggleItemOpenT', () => {
      const resp = toggleItemOpen(1, 2, true);

      expect(resp)
        .toEqual({
          type: 'TOGGLE_ITEM_OPEN',
          payload: {
            id: 1,
            itemId: 2,
            open: true
          }
        });
    });
  });

  describe('create item', () => {
    it('should create a new tree item', () => {
      const result = createItem({
        parentTreeId: 0,
        type: 'foo'
      });

      expect(result)
        .toEqual({
          parentTreeId: 0,
          type: 'foo',
          treeId: 1,
          open: false,
          opens: {},
          meta: {
            offset: 0,
            limit: 20
          }
        });
    });

    it('should increment the id', () => {
      createItem({
        parentTreeId: 0,
        type: 'foo'
      });

      const result = createItem({
        parentTreeId: 0,
        type: 'bar'
      });

      expect(result)
        .toEqual({
          parentTreeId: 0,
          type: 'bar',
          treeId: 2,
          open: false,
          opens: {},
          meta: {
            offset: 0,
            limit: 20
          }
        });
    });
  });
});
// @flow

import treeReducer from '../../../../source/iml/tree/tree-reducer.js';

describe('treeReducer', () => {
  let getTreeItem;

  beforeEach(() => {
    getTreeItem = () => ({
      treeId: 1,
      open: false,
      opens: {},
      parentTreeId: 0,
      type: 'host',
      meta: {},
      objects: []
    });
  });

  describe('adding tree items', () => {
    it('should return the new state', () => {
      const result = treeReducer({}, {
        type: 'ADD_TREE_ITEMS',
        payload: [
          getTreeItem()
        ]
      });

      expect(result)
        .toEqual({
          [1]: getTreeItem()
        });
    });

    it('should concat to existing state', () => {
      const result = treeReducer(
        {
          [1]: getTreeItem()
        },
        {
          type: 'ADD_TREE_ITEMS',
          payload: [
            {
              treeId: 2,
              open: false,
              opens: {},
              parentTreeId: 0,
              type: 'host',
              meta: {},
              objects: []
            }
          ]
        });

      expect(result)
        .toEqual({
          [1]: getTreeItem(),
          [2]: {
            treeId: 2,
            open: false,
            opens: {},
            parentTreeId: 0,
            type: 'host',
            meta: {},
            objects: []
          }
        });
    });

    it('should overwrite an existing treeItem', () => {
      const result = treeReducer(
        {
          [1]: getTreeItem()
        },
        {
          type: 'ADD_TREE_ITEMS',
          payload: [
            {
              treeId: 1,
              open: true,
              opens: {},
              parentTreeId: 0,
              type: 'host',
              meta: {},
              objects: []
            }
          ]
        }
      );

      expect(result)
        .toEqual({
          [1]: {
            treeId: 1,
            open: true,
            opens: {},
            parentTreeId: 0,
            type: 'host',
            meta: {},
            objects: []
          }
        });
    });
  });

  describe('toggle collection', () => {
    it('should return existing state when id is not found', () => {
      const result = treeReducer({}, {
        type: 'TOGGLE_COLLECTION_OPEN',
        payload: {
          id: 1,
          open: true
        }
      });

      expect(result)
        .toEqual({});
    });

    it('should update open on existing state', () => {
      const result = treeReducer(
        {
          [1]: getTreeItem()
        },
        {
          type: 'TOGGLE_COLLECTION_OPEN',
          payload: {
            id: 1,
            open: true
          }
        }
      );

      expect(result)
        .toEqual({
          [1]: {
            treeId: 1,
            open: true,
            opens: {},
            parentTreeId: 0,
            type: 'host',
            meta: {},
            objects: []
          }
        });
    });
  });

  describe('updating collection offset', () => {
    it('should return existing state when id is not found', () => {
      const result = treeReducer({}, {
        type: 'UPDATE_COLLECTION_OFFSET',
        payload: {
          id: 1,
          offset: 20
        }
      });

      expect(result)
        .toEqual({});
    });

    it('should update offset on existing state', () => {
      const result = treeReducer(
        {
          [1]: getTreeItem()
        },
        {
          type: 'UPDATE_COLLECTION_OFFSET',
          payload: {
            id: 1,
            offset: 20
          }
        }
      );

      expect(result)
        .toEqual({
          [1]: {
            treeId: 1,
            open: false,
            opens: {},
            parentTreeId: 0,
            type: 'host',
            meta: {
              offset: 20
            },
            objects: []
          }
        });
    });
  });

  describe('toggle item', () => {
    it('should return existing state when id is not found', () => {
      const result = treeReducer({}, {
        type: 'TOGGLE_ITEM_OPEN',
        payload: {
          id: 1,
          itemId: 2,
          open: true
        }
      });

      expect(result)
        .toEqual({});
    });

    it('should update open on existing state', () => {
      const result = treeReducer(
        {
          [1]: getTreeItem()
        },
        {
          type: 'TOGGLE_ITEM_OPEN',
          payload: {
            id: 1,
            itemId: 2,
            open: true
          }
        }
      );

      expect(result)
        .toEqual({
          [1]: {
            treeId: 1,
            open: false,
            opens: {
              [2]: true
            },
            parentTreeId: 0,
            type: 'host',
            meta: {},
            objects: []
          }
        });
    });
  });
});

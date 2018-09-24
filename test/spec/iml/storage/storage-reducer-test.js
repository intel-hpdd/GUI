// @flow

import storageReducer, {
  ADD_STORAGE_RESOURCE_CLASSES,
  SET_STORAGE_SELECT_INDEX,
  ADD_STORAGE_RESOURCES,
  SET_STORAGE_CONFIG,
  SET_STORAGE_SORTING,
  SET_STORAGE_TABLE_LOADING
} from "../../../../source/iml/storage/storage-reducer.js";

describe("storageReducer", () => {
  it("should be a function", () => {
    expect(storageReducer).toEqual(expect.any(Function));
  });

  it("should return an initial state", () => {
    expect(storageReducer(undefined, { type: "FOO", payload: 3 })).toMatchSnapshot();
  });

  it("should add storage resource classes", () => {
    expect(
      storageReducer(undefined, {
        type: ADD_STORAGE_RESOURCE_CLASSES,
        payload: ["foo"]
      })
    ).toMatchSnapshot();
  });

  it("should storage resources", () => {
    expect(
      storageReducer(undefined, {
        type: ADD_STORAGE_RESOURCES,
        payload: { meta: {}, objects: [] }
      })
    ).toMatchSnapshot();
  });

  it("should set the storage config", () => {
    expect(
      storageReducer(undefined, {
        type: SET_STORAGE_CONFIG,
        payload: { entries: 20, offset: 100 }
      })
    ).toMatchSnapshot();
  });

  it("should set sorting", () => {
    expect(
      storageReducer(undefined, {
        type: SET_STORAGE_SORTING,
        payload: "foo"
      })
    ).toMatchSnapshot();
  });

  it("should set sorting desc", () => {
    const state1 = storageReducer(undefined, {
      type: SET_STORAGE_SORTING,
      payload: "foo"
    });

    const state2 = storageReducer(state1, {
      type: SET_STORAGE_SORTING,
      payload: "foo"
    });

    expect(state2).toMatchSnapshot();
  });

  it("should set the select index", () => {
    expect(
      storageReducer(undefined, {
        type: SET_STORAGE_SELECT_INDEX,
        payload: 3
      })
    ).toMatchSnapshot();
  });

  it("should set the loading", () => {
    expect(
      storageReducer(undefined, {
        type: SET_STORAGE_TABLE_LOADING,
        payload: true
      })
    ).toMatchSnapshot();
  });

  it("should return the same object on no loading change", () => {
    const state1 = storageReducer(undefined, {
      type: SET_STORAGE_TABLE_LOADING,
      payload: true
    });

    const state2 = storageReducer(state1, {
      type: SET_STORAGE_TABLE_LOADING,
      payload: true
    });

    expect(state1).toBe(state2);
  });
});

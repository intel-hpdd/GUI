// @flow

import {
  addStorageResourceClasses,
  addStorageResources,
  setStorageSelectIndex,
  setStorageTableLoading,
  setStorageConfig
} from "../../../../source/iml/storage/storage-actions.js";

describe("storage actions", () => {
  it("should have a addStorageResourceClasses action", () => {
    expect(addStorageResourceClasses([])).toMatchSnapshot();
  });

  it("should have a addStorageResources action", () => {
    expect(
      addStorageResources({
        objects: []
      })
    ).toMatchSnapshot();
  });

  it("should have a setStorageResourceClassIndex action", () => {
    expect(setStorageSelectIndex(2)).toMatchSnapshot();
  });

  it("should have a setStorageTableLoading action", () => {
    expect(setStorageTableLoading(true)).toMatchSnapshot();
  });

  it("should have a setStorageConfig action", () => {
    expect(setStorageConfig({})).toMatchSnapshot();
  });
});

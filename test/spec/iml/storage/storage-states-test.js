describe('storage states', () => {
  let storageState, addStorageState, storageDetailState;

  beforeEach(() => {
    jest.mock('../../../../source/iml/storage/storage-resolves.js', () => ({
      storageB: 'storageB',
      alertIndicatorB: 'alertIndicatorB',
      getData: 'getData',
      storageResource$: 'storageResource$'
    }));

    ({
      storageState,
      addStorageState,
      storageDetailState
    } = require('../../../../source/iml/storage/storage-states.js'));
  });

  it('should create the storage state', () => {
    expect(addStorageState).toMatchSnapshot();
  });

  it('should create the storage state', () => {
    expect(storageState).toMatchSnapshot();
  });

  it('should create the storage detail state', () => {
    expect(storageDetailState).toMatchSnapshot();
  });
});

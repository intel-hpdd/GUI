import storageComponent
  from '../../../../source/iml/storage/storage-component.js';

describe('storage component', () => {
  it('should call the controller function', () => {
    spyOn(storageComponent, 'controller');
    storageComponent.controller();
    expect(storageComponent.controller).toHaveBeenCalled();
  });
});

import StorageComponent from '../../../../source/iml/storage/storage-component.js';
import StorageComponentBasic from '../../../../source/iml/storage/storage-component.js';
import Inferno from 'inferno';
import { querySelector } from '../../../../source/iml/dom-utils.js';

describe('storage component', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    Inferno.render(<StorageComponentBasic />, root);
  });

  it('should call the controller function', () => {
    spyOn(StorageComponent, 'controller');
    StorageComponent.controller();
    expect(StorageComponent.controller).toHaveBeenCalled();
  });

  it('should have the no-plugins class', () => {
    expect(querySelector(root, '.no-plugins')).not.toBeNull();
  });
});

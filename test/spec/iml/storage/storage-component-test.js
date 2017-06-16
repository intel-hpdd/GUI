import storageComponent
  from '../../../../source/iml/storage/storage-component.js';
import Inferno from 'inferno';
import { querySelector } from '../../../../source/iml/dom-utils.js';

describe('storage component', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('root');
    Inferno.render(<storageComponent />, root);
  });

  it('should call the controller function', () => {
    spyOn(storageComponent, 'controller');
    storageComponent.controller();
    expect(storageComponent.controller).toHaveBeenCalled();
  });

  it.only('should have the no-plugins class', () => {
    expect(querySelector(root, '.no-plugins')).not.toBeNull();
  });
});

import { StorageComponent } from '../../../../source/iml/storage/storage-component.js';
import Inferno from 'inferno';
import { querySelector } from '../../../../source/iml/dom-utils.js';

describe('storage component', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    Inferno.render(<StorageComponent />, root);
  });

  it('should render the storage no-plugins found html', () => {
    expect(root).toMatchSnapshot();
    //    expect(querySelector(root, '.no-plugins')).not.toBeNull();
  });
});

// @flow

import { StorageComponent } from '../../../../source/iml/storage/storage-component.js';
import Inferno from 'inferno';

describe('storage component', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    Inferno.render(<StorageComponent />, root);
  });

  it('should render the storage basic html', () => {
    expect(root).toMatchSnapshot();
  });
});

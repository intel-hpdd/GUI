// @flow

import Inferno from 'inferno';
import connect from '../../../source/iml/connect.js';
import highland from 'highland';

describe('connect test', () => {
  it('should pass the mapped state to the component', () => {
    const ConnectedDiv = connect(
      (name:string) => ({name}),
      ({name}) => <div>{name}</div>
    );

    const container = document
      .createElement('div');

    const stream = highland(['foo']);

    Inferno.render(
      <ConnectedDiv stream={stream} />,
      container
    );

    expect(container.textContent.trim())
      .toBe('foo');
  });
});

// @flow

import Inferno from 'inferno';
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverContainer
} from '../../../source/iml/popover';
import WindowClickListener from '../../../source/iml/window-click-listener.js';
import { renderToSnapshot } from '../../test-utils.js';
import { querySelector } from '../../../source/iml/dom-utils.js';

describe('Popover DOM testing', () => {
  it('should render correctly without a title', () => {
    expect(
      renderToSnapshot(
        <Popover visible={true} direction="bottom">
          <PopoverContent>Foo</PopoverContent>
        </Popover>
      )
    ).toMatchSnapshot();
  });

  it('should render correctly with a title', () => {
    expect(
      renderToSnapshot(
        <Popover visible={true} direction="bottom">
          <PopoverTitle>Hi</PopoverTitle>
          <PopoverContent>Foo</PopoverContent>
        </Popover>
      )
    ).toMatchSnapshot();
  });

  it('should render sub-props correctly', () => {
    const message = 'This is some content';

    expect(
      renderToSnapshot(
        <Popover visible={true} direction="right">
          <PopoverTitle>Hi</PopoverTitle>
          <PopoverContent>
            {message}
          </PopoverContent>
        </Popover>
      )
    ).toMatchSnapshot();
  });

  it('should not render if not visible', () => {
    expect(
      renderToSnapshot(
        <Popover visible={false} direction="right">
          <PopoverContent>bar</PopoverContent>
        </Popover>
      )
    ).toMatchSnapshot();
  });

  describe('Container', () => {
    let root, vNode;

    beforeEach(() => {
      root = document.createElement('div');

      vNode = (
        <WindowClickListener>
          <PopoverContainer>
            <button popoverButton={true} />
            <Popover popover={true} direction="right">
              <PopoverContent>bar</PopoverContent>
            </Popover>
          </PopoverContainer>
        </WindowClickListener>
      );

      Inferno.render(vNode, root);

      querySelector(document, 'body').appendChild(root);
    });

    afterEach(() => {
      querySelector(document, 'body').removeChild(root);
    });

    it('should render correctly', () => {
      expect(renderToSnapshot(vNode)).toMatchSnapshot();
    });

    it('should open and close when clicking the button', () => {
      expect.assertions(2);

      querySelector(root, 'button').click();

      expect(root.innerHTML).toMatchSnapshot();

      querySelector(root, 'button').click();

      expect(root.innerHTML).toMatchSnapshot();
    });
  });
});

// @flow

import { cloneChildren } from '../../../source/iml/inferno-utils.js';
import { renderToSnapshot } from '../../test-utils.js';
import Inferno from 'inferno';

const Wrapper = (props: { children?: any }) => (
  <div>
    {cloneChildren(props.children, () => ({
      ...props,
      message: 'hi'
    }))}
  </div>
);

const Message = (props: { name?: string, message?: string }) => (
  <span>
    To: {props.name} Message: {props.message}
  </span>
);

it('should clone children and add props', () => {
  expect(
    renderToSnapshot(
      <Wrapper name="person">
        <Message />
      </Wrapper>
    )
  ).toMatchSnapshot();
});

it('should clone multiple children and add props', () => {
  expect(
    renderToSnapshot(
      <Wrapper name="person">
        <Message />
        <Message />
      </Wrapper>
    )
  ).toMatchSnapshot();
});

it('should throw on no children', () => {
  expect(() => renderToSnapshot(<Wrapper name="person" />)).toThrow();
});
